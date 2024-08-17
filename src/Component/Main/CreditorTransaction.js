import React, { useCallback, useEffect, useState } from "react";
import Header from "../../Utilities/Header";
import NavBar from "../../Utilities/NavBar";
import moment from "moment";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { calculateTotalDebt, thousandSeperator } from "../../Utilities/helper";
// import { toast } from 'react-toastify';

function CreditorTransaction() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState();
  const [paid, setPaid] = useState([]);
  // const [bal, setBal] = useState([])
  const params = useParams();
  const { creditorId } = params;
  console.log(params, "creditor");

  const location = useLocation();
  if (location.state === null) {
    console.log("NOthing is coming from the eachCreditor component");
  }
  const creditorDetails = location.state;
  const { firstName, lastName, phoneNumber } = creditorDetails;

  const CreditorUrl = `http://localhost:8080/creditorBal/${creditorId}`;
  const CreditorUrl2 = `http://localhost:8080/credit/${creditorId}`;

  const getList = useCallback(() => {
    axios
      .get(CreditorUrl2)
      .then((response) => {
        console.log(response.data.credits, "see");
        const transactionDetail = response.data.credits;
        setTransaction(transactionDetail);
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get(CreditorUrl).then((response) => {
      console.log(response.data.creditBal, "credit here");
      setPaid(response.data.creditBal);
    });
  }, [CreditorUrl, creditorId, params]);

  useEffect(() => {
    console.log(creditorId, params, "usssssssss");
    getList();
  }, [getList]);

  console.log(transaction, paid);
  const renderCreditTransaction = paid?.map((item, id) => {
    // console.log(item, "item")
    return (
      <div key={id} className="table">
        <tr>
          <td>{moment(item.createdAt).format("DD/MM/YYYY")}</td>
          <td>{thousandSeperator(item.paid)}</td>
        </tr>
      </div>
    );
  });
  const renderTransaction = transaction?.map((item, id) => {
    return (
      <div key={id} className="table">
        <tr>
          <td>{moment(item.date).format("DD/MM/YYYY")}</td>
          <td>{thousandSeperator(item.total)}</td>
        </tr>
      </div>
    );
  });

  const totalPurchase = transaction
    ?.map((val) => val.total)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const totalPaid = paid
    ?.map((val) => val.paid)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (
    <div>
      <Header />
      <NavBar />
      <div>
        <div className="flex align-items-center justify-center mb-3">
          <div className="relative top-12 font-bold text-3xl text-gray-600">
            Transaction detail of {firstName + " " + lastName}
          </div>
          <span className="relative top-12 font-bold text-3xl text-gray-600 ml-5">
            {phoneNumber}
          </span>
        </div>
        <div className="">
          <table className="flex justify-center mt-5">
            <div className="w-[30%]">
              <tr>
                <th>Date</th>
                <th>Credit</th>
              </tr>
              {renderTransaction}
            </div>
            <div className="w-[30%] ml-10">
              <tr>
                <th>Date</th>
                {/* <th>Purchase</th> */}
                <th>Cash Paid</th>
                {/* <th>Balance</th> */}
              </tr>
              {renderCreditTransaction}
            </div>
          </table>
          <div className="flex justify-center mt-5 space-x-8">
            <div className="text-xl font-bold"></div>
            <div className="text-xl font-[600]">
              Total credit: {thousandSeperator(totalPurchase)}
            </div>
            <div className="text-xl font-[600]">
              Cash Paid: {thousandSeperator(totalPaid)}
            </div>
            <div className="text-xl font-[600] ml-2">
              Balance: {thousandSeperator(totalPurchase - totalPaid)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditorTransaction;
