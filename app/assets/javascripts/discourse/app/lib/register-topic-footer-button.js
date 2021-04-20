import I18n from "I18n";
import { computed } from "@ember/object";
import error from "@ember/error";

let _topicFooterButtons = {};

export function registerTopicFooterButton(button) {
  if (!button.id) {
    error(`Attempted to register a topic button: ${button} with no id.`);
    return;
  }

  if (_topicFooterButtons[button.id]) {
    return;
  }

  const defaultButton = {
    // id of the button, required
    id: null,

    // icon displayed on the button
    icon: null,

    // local key path for title attribute
    title: null,
    translatedTitle: null,

    // local key path for label
    label: null,
    translatedLabel: null,

    // local key path for aria label
    ariaLabel: null,
    translatedAriaLabel: null,

    // is this button disaplyed in the mobile dropdown or as an inline button ?
    dropdown: false,

    // css class appended to the button
    classNames: [],

    // discourseComputed properties which should force a button state refresh
    // eg: ["topic.bookmarked", "topic.category_id"]
    dependentKeys: [],

    // should we display this button ?
    displayed: true,

    // is this button disabled ?
    disabled: false,

    // display order, higher comes first
    priority: 0,
  };

  const normalizedButton = Object.assign(defaultButton, button);

  if (
    !normalizedButton.icon &&
    !normalizedButton.title &&
    !normalizedButton.translatedTitle
  ) {
    error(
      `Attempted to register a topic button: ${button.id} with no icon or title.`
    );
    return;
  }

  _topicFooterButtons[normalizedButton.id] = normalizedButton;
}

export function getTopicFooterButtons() {
  const dependentKeys = [].concat(
    ...Object.values(_topicFooterButtons)
      .map((tfb) => tfb.dependentKeys)
      .filter((x) => x)
  );

  return computed(...dependentKeys, {
    get() {
      const _isFunction = (descriptor) =>
        descriptor && typeof descriptor === "function";

      const _compute = (button, property) => {
        const field = button[property];

        if (_isFunction(field)) {
          return field.apply(this);
        }

        return field;
      };

      return Object.values(_topicFooterButtons)
        .filter((button) => _compute(button, "displayed"))
        .map((button) => {
          const discourseComputedButton = {};

          discourseComputedButton.id = button.id;

          const label = _compute(button, "label");
          discourseComputedButton.label = label
            ? I18n.t(label)
            : _compute(button, "translatedLabel");

          const ariaLabel = _compute(button, "ariaLabel");
          if (ariaLabel) {
            discourseComputedButton.ariaLabel = I18n.t(ariaLabel);
          } else {
            const translatedAriaLabel = _compute(button, "translatedAriaLabel");
            discourseComputedButton.ariaLabel =
              translatedAriaLabel || discourseComputedButton.label;
          }

          const title = _compute(button, "title");
          discourseComputedButton.title = title
            ? I18n.t(title)
            : _compute(button, "translatedTitle");

          discourseComputedButton.classNames = (
            _compute(button, "classNames") || []
          ).join(" ");

          discourseComputedButton.icon = _compute(button, "icon");
          discourseComputedButton.disabled = _compute(button, "disabled");
          discourseComputedButton.dropdown = _compute(button, "dropdown");
          discourseComputedButton.priority = _compute(button, "priority");

          if (_isFunction(button.action)) {
            discourseComputedButton.action = () => button.action.apply(this);
          } else {
            const actionName = button.action;
            discourseComputedButton.action = () => this[actionName]();
          }

          return discourseComputedButton;
        })
        .sortBy("priority")
        .reverse();
    },
  });
}

export function clearTopicFooterButtons() {
  _topicFooterButtons = [];
}
