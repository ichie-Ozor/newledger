import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/auth";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { baseUrl, thousandSeperator } from "../Utilities/helper";
import axios from "axios";

function Invoice({ creditor, stock, closeInvoice }) {
  const [today, setToday] = useState("");
  const [desc, setDesc] = useState([]);
  const [itemName, setItemName] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [isToggle, setIsToggle] = useState(false);
  const [item, setItem] = useState({});
  const [invoiceItem, setInvoiceItem] = useState([]);
  const [print, setPrint] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [invoiceInput, setInvoiceInput] = useState({
    qty: "",
    rate: "",
  });
  const auth = useAuth();
  const { fullName, businessName } = auth.user;
  const { firstName, lastName, phoneNumber, createdBy, _id } = creditor;
  console.log(_id, "creditor id");
  const baseUrlPost = baseUrl + "/invoice";

  useEffect(() => {
    const baseUrl5 = baseUrl + `/stock/${createdBy}`;
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    setToday(formattedDate);

    const randomNum =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const word = businessName.split(" ");
    let f = word[0][0].toUpperCase();
    let l = word[1] ? word[1][0].toUpperCase() : "";
    const invoiceNo = f + l + "-" + randomNum;
    setInvoiceId(invoiceNo);

    axios
      .get(baseUrl5)
      .then((response) => {
        setDesc(response?.data?.Stock);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message || "Something went wrong, try aain later!"
        );
      });
  }, [businessName, createdBy]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(invoiceInput.qty, invoiceInput.rate, item.goods, "ffffffffff");
    if (!invoiceInput.qty || !invoiceInput.rate || !item.goods) {
      toast.error("Please complete the item details before adding.");
      return;
    }

    const newItem = {
      id: new Date().getMilliseconds(),
      description: item.goods,
      category: item.category,
      qty: parseInt(invoiceInput.qty, 10),
      rate: parseFloat(invoiceInput.rate),
      unit: isToggle ? "crt" : "pcs",
      total: invoiceInput.qty * invoiceInput.rate,
    };

    const newInvoiceData = {
      ...newItem,
      businessId: createdBy,
      invoiceId,
      creditorId: _id,
      date: new Date(),
      paymentMethod: paymentMethod || "cash",
      businessPhone: auth?.user?.phoneNumber,
      crditorPhone: phoneNumber,
      businessName,
      ownerName: fullName,
      creditorName: `${firstName} ${lastName}`,
    };

    setInvoiceItem((prev) => [...prev, newItem]);
    setInvoiceData((prev) => [...prev, newInvoiceData]);
    setInvoiceInput({ qty: "", rate: "" });
    setItemName("");
    setItem({});
    setIsToggle(false);
  };
  console.log(
    invoiceInput,
    "input item here",
    invoiceItem,
    "creditor",
    invoiceData,
    "xxxxxxxx",
    auth?.user
  );

  const itemNameHandler = (value) => {
    setItemName(value?.goods || value?.category);
    console.log(value, "choosen item");
    setInvoiceInput({
      qty: 1,
      rate: value?.sellingPrice,
    });
    setItem(value);
  };

  const amountToggle = () => setIsToggle(!isToggle);

  const onChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // setInvoiceInput({
    //     ...invoiceInput, [name]: value
    // })
    setInvoiceInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const paymentHandler = (e) => {
    const { name, checked } = e.target;
    setPaymentMethod((prev) => {
      const updated = checked
        ? [...prev, name]
        : prev.filter((method) => method !== name);
      return updated;
    });
  };

  const viewPrintHandler = (e) => {
    e.preventDefault();
    if (invoiceData.length === 0) {
      toast.error("Add at least one item beofre printing");
      return;
    }
    setPrint(true);
  };

  //////////////////print///////////////
  const componentRef = React.useRef(null);

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  console.log(invoiceData, "invoice");
  // const handleBeforePrint = React.useCallback(() => {
  //     console.log("`onBeforePrint` called", invoiceData);
  //     axios({
  //         method: 'post',
  //         url: baseUrlPost,
  //         data: invoiceData
  //     }).then((result) => {
  //         console.log(result, 'invoice posted')
  //         toast.success('Invoice saved successfully')
  //     }).catch(error => {
  //         console.log(error, "invoice error")
  //         toast.error(error.response.data.message || "There is an error while savine the invoice, try again later")
  //     })
  //     return Promise.resolve();
  // }, []);

  const handleBeforePrint = React.useCallback(() => {
    if (invoiceData.length === 0) {
      toast.error("No data to save");
      return Promise.reject();
    }
    return axios
      .post(baseUrlPost, invoiceData)
      .then((result) => {
        toast.success("invoice saved successfully");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Error saving invoice, try aain later"
        );
      });
  }, [invoiceData, baseUrlPost]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Invoice",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });
  /////////////////////////////////////////////////

  const renderInvoice = invoiceItem.map((item, idx) => {
    return (
      <>
        <tr key={item.id} className="hover:bg-gray-100">
          <td className="p-2 text-left border border-gray-400 w-1/12">
            {idx + 1}
          </td>
          <td className="align relative w-1/3 p-2 text-left border border-gray-400">
            {item?.description}
          </td>
          <td className="justify-end relative w-1/3 p-2 text-left border border-gray-400">
            {item?.category}
          </td>
          <td className="justify-end relative text-left w-1/12 border border-gray-400">
            {item?.qty + item.unit}
          </td>
          <td className="justify-end relative text-left w-1/3 border border-gray-400">
            {item?.rate}
          </td>
          <td className="justify-end relative p-2 text-left border border-gray-400 w-1/3">
            {item?.total}
          </td>
        </tr>
      </>
    );
  });
  return (
    <div className="fixed bg-red-800 inset-0 bg-opacity-40 backdrop-blur-sm flex md:justify-center md:items-center overflow-auto">
      <div className="relative top-20 min-h-[100vh] left-0 w-[60rem] bg-white rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="#5f6368"
          className="absolute right-6 top-4 cursor-pointer"
          onClick={closeInvoice}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
        {print ? (
          <>
            <div
              className="relative top-10 mx-8 p-12 bg-white rounded-lg shadow-2xl"
              ref={componentRef}
              id="invoiceSection"
            >
              <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">{businessName}</h1>
              <h6 className="text-gray-600 text-center mb-10 text-lg">
                2A France Road Sabon Gari Kano
              </h6>
              
              <div className="grid grid-cols-6 gap-12 mb-10">
                <div className="col-start-1 col-end-3">
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{fullName}</h4>
                    <h6 className="text-gray-600 text-lg">{auth?.user?.phoneNumber}</h6>
                  </div>
                  <div className="space-y-3">
                    <span className="block text-gray-700 text-lg">
                      <span className="font-bold">Invoice #:</span> 
                      <span className="ml-3 text-gray-600">{invoiceId}</span>
                    </span>
                    <span className="block text-gray-700 text-lg">
                      <span className="font-bold">Date:</span>
                      <span className="ml-3 text-gray-600">{today}</span>
                    </span>
                  </div>
                </div>
                <div className="col-start-5 col-end-7">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{firstName + " " + lastName}</h4>
                  <h6 className="text-gray-600 text-lg">{phoneNumber}</h6>
                </div>
              </div>

              <div className="w-full h-[2px] bg-gray-200 my-8"></div>

              <div className="w-full overflow-x-auto rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 border border-gray-200">SN</th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 border border-gray-200 w-1/3">Description</th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 border border-gray-200 w-1/4">Category</th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 border border-gray-200 w-1/4">Qty</th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 border border-gray-200 w-1/4">Rate</th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-800 border border-gray-200 w-1/4">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">{renderInvoice}</tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={handlePrint}>Print Now</button>
            </div>
          </>
        ) : (
          <>
            <div className="max-w-5xl mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{businessName}</h1>
                <h6 className="text-gray-600 text-center mb-10">
                  2A France Road Sabon Gari Kano
                </h6>

                <div className="grid grid-cols-2 gap-12 mb-10">
                  <div>
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{fullName}</h4>
                      <h6 className="text-gray-600">{auth?.user?.phoneNumber}</h6>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="font-bold text-gray-700">Invoice #:</span>
                        <span className="ml-2 text-gray-600">{invoiceId}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-gray-700">Date:</span>
                        <span className="ml-2 text-gray-600">{today}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{firstName + " " + lastName}</h4>
                    <h6 className="text-gray-600">{phoneNumber}</h6>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8"></div>

                <form onSubmit={submitHandler} className="mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        placeholder="Search for goods"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {itemName && (
                        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                          {desc
                            .filter((item) => {
                              const searchItem = itemName?.toLowerCase();
                              const cat = item?.category?.toLowerCase();
                              const good = item?.goods?.toLowerCase();
                              return searchItem && (good?.startsWith(searchItem) || cat?.startsWith(searchItem)) && good !== searchItem;
                            })
                            .map((t) => (
                              <div
                                key={t._id}
                                onClick={() => itemNameHandler(t)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {t.description || t.category}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={amountToggle}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isToggle ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {isToggle ? 'CRT' : 'PCS'}
                    </button>

                    <input
                      type="number"
                      placeholder="Qty"
                      name="qty"
                      value={invoiceInput.qty}
                      onChange={onChange}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="number"
                      placeholder="Rate"
                      name="rate"
                      value={invoiceInput.rate}
                      onChange={onChange}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <button 
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Item
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {renderInvoice}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8">
                  <form className="max-w-sm mx-auto bg-white rounded-lg shadow-sm p-6">
                    <div className="space-y-4 mb-6">
                      {["pos", "cash", "transfer"].map((item, index) => (
                        <label key={index} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name={item}
                            onChange={paymentHandler}
                            checked={paymentMethod.includes(item)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700 capitalize">{item}</span>
                        </label>
                      ))}
                    </div>

                    <button
                      onClick={viewPrintHandler}
                      disabled={invoiceData.length === 0}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Generate Invoice
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Invoice;
