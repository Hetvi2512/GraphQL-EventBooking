import React, { useState, useContext } from "react";
import authContext from "./../../context/AuthContext";
import "./BookingLis.css";
export default function BookingList(props) {
  const [bookings, setBookings] = useState(props.bookings);
  console.log(bookings);
  const { token } = useContext(authContext);

  const onDelete = (bookingId) => {
    console.log("In");
    const requestBody = {
      query: `
      mutation CancelBooking($id: ID!) {
        cancelBooking(bookingId: $id) {
        _id
         title
        }
      }
    `,
      variables: {
        id: bookingId,
      },
    };

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          console.log(res);
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedBooking = bookings.filter((booking) => {
          return booking._id !== bookingId;
        });

        setBookings(updatedBooking);
        return bookings;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1 className="booking">Your Bookings</h1>
      <ul className="bookings__list">
        {bookings.map((booking) => {
          return (
            <li key={booking._id} className="bookings__item">
              <div className="bookings__item-data">
                {booking.event.title} -{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </div>
              <div className="bookings__item-actions">
                <button
                  className="btn"
                  onClick={() => {
                    onDelete(booking._id);
                  }}
                >
                  Cancel
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
