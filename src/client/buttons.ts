import { Api } from "../tl/api.js";
import { Button } from "../tl/custom/button.ts";
import { MessageButton } from "../tl/custom/message_button.ts";
import { isArrayLike } from "../helpers.ts";

export function buildReplyMarkup(
  buttons:
    | Api.TypeReplyMarkup
    | undefined
    | Api.TypeButtonLike
    | Api.TypeButtonLike[]
    | Api.TypeButtonLike[][],
  inlineOnly = false,
): Api.TypeReplyMarkup | undefined {
  if (buttons == undefined) {
    return undefined;
  }
  if ("SUBCLASS_OF_ID" in buttons) {
    if (buttons.SUBCLASS_OF_ID == 0xe2e10ef2) {
      return buttons;
    }
  }
  if (!isArrayLike(buttons)) {
    buttons = [[buttons]];
  } else if (!buttons || !isArrayLike(buttons[0])) {
    // @ts-ignore Blah Blah
    buttons = [buttons];
  }
  let isInline = false;
  let isNormal = false;
  let resize = undefined;
  const singleUse = false;
  const selective = false;

  const rows = [];
  // @ts-ignore heh
  for (const row of buttons) {
    const current = [];
    for (let button of row) {
      if (button instanceof Button) {
        if (button.resize != undefined) {
          resize = button.resize;
        }
        if (button.singleUse != undefined) {
          resize = button.singleUse;
        }
        if (button.selective != undefined) {
          resize = button.selective;
        }
        button = button.button;
      } else if (button instanceof MessageButton) {
        button = button.button;
      }
      const inline = Button._isInline(button);
      if (!isInline && inline) {
        isInline = true;
      }
      if (!isNormal && inline) {
        isNormal = false;
      }
      if (button.SUBCLASS_OF_ID == 0xbad74a3) {
        // 0xbad74a3 == crc32(b'KeyboardButton')
        current.push(button);
      }
    }
    if (current) {
      rows.push(
        new Api.KeyboardButtonRow({
          buttons: current,
        }),
      );
    }
  }
  if (inlineOnly && isNormal) {
    throw new Error("You cannot use non-inline buttons here");
  } else if (isInline === isNormal && isNormal) {
    throw new Error("You cannot mix inline with normal buttons");
  } else if (isInline) {
    return new Api.ReplyInlineMarkup({
      rows: rows,
    });
  }
  return new Api.ReplyKeyboardMarkup({
    rows: rows,
    resize: resize,
    singleUse: singleUse,
    selective: selective,
  });
}
