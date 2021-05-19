import React, { useState, useEffect, useContext } from "react";
import authContext from "./../context/AuthContext";
import Spinner from "./../components/Spinner/Spinner";
import BookingList from "../components/Booking/BookingList";
import BookingsChart from "../components/Booking/BookingsChart/BookingsChart";
import BookingsControl from "./../components/Booking/BookingsControl";
export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState("List");
  const { token } = useContext(authContext);
  useEffect(() => {
    fetchBookings();
  }, []);
  const fetchBookings = () => {
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               price
               date
             }
            }
          }
        `,
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
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const onChange = (outputType) => {
    if (outputType === "List") {
      setOutputType("List");
    } else {
      setOutputType("Chart");
    }
  };
  let content = <Spinner />;
  if (!loading) {
    content = (
      <>
        <div>
          <BookingsControl activeOutputType={outputType} onChange={onChange} />
        </div>
        <div>
          {outputType === "List" ? (
            <BookingList bookings={bookings} />
          ) : (
            <BookingsChart bookings={bookings} />
          )}
        </div>
      </>
    );
  }
  return <div>{content}</div>;
}
