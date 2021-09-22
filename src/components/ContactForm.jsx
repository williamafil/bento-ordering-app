import React from "react";
import Input from "./UI/Form/Input";
import Textarea from "./UI/Form/Textarea";
import Modal from "./UI/Modal/Modal";

import clxs from "../utils/clxs";

const ContactForm = (props) => {
  return (
    <>
      <Modal onCloseModal={props.onHideModalHandler}>
        <form>
          <fieldset className="mb-4">
            <label htmlFor="contact-name" className="text-sm font-bold">
              名字
            </label>
            <Input
              id="contact-name"
              name="contact-name"
              type="text"
              className="border border-black px-4 py-2"
              checked={null}
              value={props.contactName}
              onChange={props.onInputHandler}
            />
          </fieldset>
          <fieldset className="mb-4">
            <label htmlFor="contact-number" className="text-sm font-bold">
              聯絡電話
            </label>
            <Input
              id="contact-number"
              name="contact-number"
              type="text"
              className="border border-black px-4 py-2"
              checked={null}
              value={props.contactNumber}
              onChange={props.onInputHandler}
            />
          </fieldset>
          <fieldset className="mb-4">
            <label htmlFor="contact-note" className="text-sm font-bold">
              備註
            </label>
            <Textarea
              id="contact-note"
              name="contact-note"
              type="text"
              rows="3"
              className="border border-black px-4 py-2"
              value={props.contactNote}
              onChange={props.onInputHandler}
            />
          </fieldset>
          <button
            type="submit"
            className={clxs(
              "border border-black rounded-sm px-4 py-2",
              !props.formIsValid &&
                "cursor-not-allowed text-gray-300 border-gray-300 bg-gray-100",
            )}
            disabled={!props.formIsValid}
            onClick={props.onCheckoutOrder}
          >
            送出訂單
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ContactForm;
