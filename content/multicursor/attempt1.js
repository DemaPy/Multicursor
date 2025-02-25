// ======================== OLD ========================

// 1
// Track all textareas where:
// -display: block and visibility: not hidden

// 2
// Set click event and get caret position for each textarea,On Alt+Left click add cursor for selected place inside textarea
// Possible solutions:
// DIV OVER EACH TEXTAREA
// Create div over each textarea with contentEditable property.
// Wrap textarea into container with relative position in order to add div absolute position.
// Copy value from textarea and paste inside div
// Track textarea resizing
// Track div input and mirror to textarea

// 3
// Set text at caret position in textarea
// In case of selected 2 textareas: If something will be inside some textarea it will duplicate content for every selected textarea.
// Possible solutions:
// Need to have 1 source of truth. I should have my own textarea in order to track input and provide it for selected textareas.

// HIDDEN TEXTAREA -> BAD APPROACH
// Create hidden textarea and track input in it.
// For hidden textarea focus event is not executed.
// Provide then value for selected textareas
// this.textarea.node.focus()

// TRACK KEYDOWN/KEYPRESS EVENT -> BAD APPROACH
// Iterate over each selected textarea and povide value
// KeyPress event is invoked only for character (printable) keys,
// KeyDown event is raised for all including nonprintable such as Control, Shift, Alt, BackSpace, etc.
// Need to create everything from scratch.
// Backspace handling, Space body scrolling, Enter and etc...

// TEXTAREA SMALL SIZE -> ???
// Create small size textarea and track input in it.

// Textara can be removed from DOM need to observer it and remove from textareas

class TextareaObject {
  node;
  caret;
  constructor({ node, caret }) {
    this.node = node;
    this.caret = caret || null;
  }

  setCaret(position) {
    this.caret = position;
  }

  clearCaret() {
    this.caret = null;
  }
}

const app = {
  rootTextarea: null,
  textareas: null,

  init() {
    const textareas = document.querySelectorAll("textarea");
    this.textareas = this.filterInactive(textareas);
    this.rootTextarea = this.ui.createNode("textarea", { height: "1px", })
  },

  filterInactive(textareas) {
    const filtered_items = [];
    for (const item of [...textareas]) {
      if (item.style.display === "none") continue;
      if (item.style.visibility === "hidden") continue;
      filtered_items.push(
        this.addListenerInstance(
          this.createTextAreaInstance(this.createDivOverEachTextArea(item))
        )
      );
    }
    return filtered_items;
  },

  createTextAreaInstance(item) {
    return new TextareaObject({
      node: item,
    });
  },

  applyNodeStyle(from, to) {
    // Get values with scroll bar
    const { width, height } = from.getBoundingClientRect();

    const TEXTAREA_STYLE = getComputedStyle(from);
    [
      "border",
      "boxSizing",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "letterSpacing",
      "lineHeight",
      "padding",
      "textDecoration",
      "textIndent",
      "textTransform",
      "whiteSpace",
      "wordSpacing",
      "wordWrap",
    ].forEach((property) => {
      to.style[property] = TEXTAREA_STYLE[property];
    });
    to.style.width = width + "px";
    to.style.height = height + "px";

    const parseValue = (v) =>
      v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0;

    const borderWidth = parseValue(TEXTAREA_STYLE.borderWidth);
    const ro = new ResizeObserver(() => {
      to.style.width = `${from.clientWidth + 2 * borderWidth}px`;
      to.style.height = `${from.clientHeight + 2 * borderWidth}px`;
    });
    ro.observe(from);
  },

  createDivOverEachTextArea(textarea) {
    // Extract EXACT style values from textarea
    const container = this.ui.createNode("div");
    container.style.position = "relative";

    const div = this.ui.createNode("div");
    div.setAttribute("contenteditable", true);

    // STYLE
    this.applyNodeStyle(textarea, div);
    div.style.position = "absolute";
    div.style.inset = "0px";
    // Block overflow for mirrored element in order to mirror it from textarea
    div.style.overflow = "hidden";
    div.style.color = "transparent";
    div.style.boxSizing= "border-box"
    // STYLE

    // VALUE
    div.textContent = textarea.value;
    // VALUE

    div.addEventListener("input", (ev) => {
      textarea.value = div.textContent
    })

    textarea.addEventListener("scroll", (ev) => {
      div.scrollTop = textarea.scrollTop;
    })

    textarea.insertAdjacentElement("beforebegin", container);
    textarea.remove();

    container.append(textarea);
    container.append(div);
    return textarea;
  },

  ui: {
    createNode(name, style) {
      const node = document.createElement(name);
      node.style = style
      return node;
    },
  },

  addListenerInstance(item) {
    item.node.addEventListener("click", (ev) => {
      if (ev.altKey) {
        const selectionStart = ev.target.selectionStart;
        item.setCaret(selectionStart);
        ev.target.blur();
        console.log(app);
      }
    });

    return item;
  },

  updateValue(value) {
    for (const textarea of this.textareas) {
      if (textarea.caret !== null) {
        textarea.node.value = textarea.node.value + value;
      }
    }
  },
};

app.init();
