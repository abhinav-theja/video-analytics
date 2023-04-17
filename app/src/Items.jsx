import React, { useEffect } from "react";
import Plyr from "plyr";
// import css
import "plyr/dist/plyr.css";
import moment from "moment";

function Items(props) {
  const [items, setItems] = React.useState([]);

  const getItems = () => {
    fetch("http://159.89.55.158:4000/items")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        data.map((item, key) => {
          const player = new Plyr("#player-" + key, {
            controls: ["play", "progress", "current-time", "mute", "volume"],
          });
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const DeleteItem = (id) => {
    fetch(`http://159.89.55.158:4000/items/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        getItems();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    getItems();
  }, [props.data]);

  return (
    <div className="rounded mt-3 p-3 m-0 p-0">
      <div className="row">
        {items.map((item, key) => (
          <div
            class="card col-5 m-2 p-0"
            // style={{
            //   width: "18rem",
            // }}
          >
            <video id={`player-${key}`} playsinline controls>
              <source
                src={`http://159.89.55.158:4000/${item.image}`}
                type="video/mp4"
              />
            </video>
            <div class="card-body p-4">
              <h5 class="card-title mb-0">{item.name}</h5>
              <p class="card-text mb-0">{item.description}</p>
              <div>
                {item?.predictions.map((prediction, index) => (
                  <span class="badge text-bg-primary me-2">
                    {prediction?.class}
                  </span>
                ))}
              </div>
              {/* created_at,updatedAt */}
              <div className="row">
                <div className="col-6">
                  <p className="mb-0">
                    Created At:
                    {/* relative time */}
                    {moment(item?.createdAt).startOf("hour").fromNow()}
                  </p>
                  <p className="mb-0">
                    Updated At:{" "}
                    {moment(item?.updatedAt).startOf("hour").fromNow()}
                  </p>
                </div>

                <div className="col-6">
                  <button
                    type="button"
                    class="btn btn-danger mt-2"
                    onClick={() => {
                      DeleteItem(item._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* delete button */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Items;
