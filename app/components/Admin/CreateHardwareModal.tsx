import classNames from "classnames";
import { useEffect } from "react";
import { useState } from "react";
import { Form, useActionData, useTransition } from "remix";
import AppNanoid from "~/utils/nanoid";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const CreateHardwareModal: React.FC = (props) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const transition = useTransition();
  const action = useActionData<ActionData>();

  function handleRandom() {
    setId(AppNanoid());
  }
  useEffect(() => {
    console.log(action);
    
    if (action && Object.keys(action).length === 0) {
      setOpen(false);
      setId("");
    }
  }, [action]);
  return (
    <>
      <button
        className="btn btn-primary modal-button"
        onClick={() => setOpen(true)}
      >
        Add Hardware
      </button>
      <Form
        className={classNames("modal", {
          "modal-open": open,
        })}
        method="post"
      >
        <div className="modal-box prose">
          <h3>เพิ่ม Hardware เข้าระบบ</h3>
          <div className="form-control">
            <label htmlFor="hw_id" className="label">
              <span className="label-text">Hardware ID</span>
            </label>
            <div className="relative">
              <input
                name="id"
                id="hw_id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                placeholder="Search"
                className="w-full pr-16 input input-primary input-bordered"
              />
              <button
                type="button"
                onClick={handleRandom}
                className="absolute top-0 right-0 rounded-l-none btn btn-primary"
              >
                Random
              </button>
            </div>
          </div>
          <div className="modal-action">
            <button
              type="submit"
              disabled={Boolean(transition.submission)}
              className="btn btn-primary"
            >
              เพิ่ม
            </button>
            <button type="reset" className="btn" onClick={() => setOpen(false)}>
              ยกเลิก
            </button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default CreateHardwareModal;
