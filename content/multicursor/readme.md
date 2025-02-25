TASK: Multicursor for input or textareas
https://stackoverflow.com/questions/16690433/sublime-like-multiple-cursors-in-html5
https://github.com/ajaxorg/ace/blob/ffbb6b25231bcc2cea49cc2788b93e32498efde7/src/multi_select.js
https://ace.c9.io/

Ace editor:
Creates textarea under click.
If user create more than one cursor, textarea changes position right under next cursor click.
{
  opacity: 0;
  font-size: 1px;
  height: 1px;
  width: 1px;
  top: 112px;
  left: 182px;
}

Creates div (cursor) under EACH click.
Cursors located under absolute parent which is covers all input space.
In order to have cursors for each textarea/input need to have absolute parent and place cursors under mouse click.

======================== TASK ========================
- Create textarea, absolute parent for div(cursor) under mouse click + alt.
- Div's (cursors) must be located under absolute parent.
- If on the page more than 1 textarea -> expand absolute parent to borders of input area
- When user create multicursor (click + alt) -> check if click was within textarea or input borders.