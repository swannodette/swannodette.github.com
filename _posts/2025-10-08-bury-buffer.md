I've been spending a lot more time recently with Emacs. While I never gave up on [org-mode](https://orgmode.org/index.html), my Emacs usage had otherwise been in decline. A few months ago, I started experimenting with some "new" affordances: [vertico](https://github.com/emacs-straight/vertico#verticoel---vertical-interactive-completion), [marginalia](https://github.com/minad/marginalia#marginaliael---marginalia-in-the-minibuffer), [orderless](https://github.com/oantolin/orderless#orderless), [consult](https://github.com/minad/consult#consultel---consulting-completing-read) and [embark](https://github.com/oantolin/embark#embark-emacs-mini-buffer-actions-rooted-in-keymaps). The combined UX of these tools was impressive, and unlike similar functionality in, say, IntelliJ, could be used in far more contexts. When it comes to mainstream software, not much has changed since I first played around with an Apple IIgs nearly 40 years ago - disjointed islands that the user must travel between over and over again. Emacs delivers a non-feudal vision of personal computing. Perhaps [Jef Raskin was right all along](https://en.wikipedia.org/wiki/Canon_Cat).

Coming back to everyday Emacs usage resurfaced one of my frustrations: Emacs window management. Without getting into the weeds, I devised a system that works for me both on large screens with many window splits, and on a MacBook Air where I have at most one split. The following snippet was arrived at with the help of Claude running in [gptel](https://github.com/karthink/gptel#gptel-a-simple-llm-client-for-emacs). I'm a Elisp noob, so I apologize in advance for any LLM vagaries.

```elisp
(defun my/get-display-window
  (source-window &optional create-if-needed)
  (save-excursion
    (goto-char (window-start source-window))
    (or
      (window-in-direction 'right source-window)
      (let ((below-window (window-in-direction 'below source-window)))
        (when (and below-window
                   (not (window-minibuffer-p below-window)))
          below-window))
       (when create-if-needed
         (split-window source-window nil 'below)))))
```

The `(goto-char ...)` bit is necessary since the "right" window is the one to the right of the cursor not the current window. Without this bit you run into trouble if there is a horizontal split next to the current window.

Integrating this with a particular package eliminates the behavior of a "random" buffer being chosen for display. For example with [magit](https://magit.vc/):

```elisp
(defun my/magit-display-buffer (buffer alist)
  (when-let ((target-window (my/get-display-window
                              (selected-window) t)))
    (set-window-buffer target-window buffer)
    target-window))

(add-to-list 'display-buffer-alist
  '("\\(magit-revision:\\|magit-diff:\\)"
     (my/magit-display-buffer)
    (inhibit-same-window . t)))
```

This setup combined with binding `bury-buffer` makes using Emacs windows superior to pretty much anything else I have on my computer. What is `bury-buffer` you ask? Every window has its own list of buffers it has displayed, `bury-buffer` pushes the top buffer for a window to the bottom of the list. So if some unruly package displays a buffer in some undesirable window, you can just bury it to get back to where you were.

The three other tools I find useful for dealing with Emacs windows:

-   [avy](https://github.com/abo-abo/avy#introduction), to jump to any location in any window quickly
-   [ace-window](https://github.com/abo-abo/ace-window#ace-window), to jump to any window + some useful commands
-   tab bar mode, for managing a group of windows like ERC

I have quite a bit more to say about Emacs, but there are some ClojureScript things afoot as well, stay tuned!
