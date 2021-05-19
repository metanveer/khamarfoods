import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { sslcommerz } from "../sslcommerz.js";
import axios from "axios";

// @desc    Payment success message to user
// @route   POST /api/success
// @access  Public
const getPaymentSuccessMsg = asyncHandler(async (req, res) => {
  const transId = req.query.txid;
  const orderIdSuccessUrl = req.query.orderid;

  try {
    const url = process.env.SSLCOMMERZ_TXID_VALIDATION_URL;
    const config = {
      params: {
        tran_id: transId,
        store_id: process.env.STORE_ID,
        store_passwd: process.env.STORE_PASSWORD,
      },
    };
    const { data } = await axios.get(url, config);
    console.log(data);
    const order = await Order.findById(orderIdSuccessUrl);

    if (data.APIConnect === "DONE" && data.no_of_trans_found === 1 && order) {
      const { val_id, status, tran_id, tran_date, amount } = data.element[0];
      order.isPaid = true;
      order.paidAt = tran_date;
      order.paymentResult = {
        status: status,
        validation_id: val_id,
        transaction_id: tran_id,
        transaction_amount: amount,
      };

      await order.save();

      res.send("Transaction Successful! Pls close this window.");
    }
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error(error);
  }
});
const getPaymentFailMsg = asyncHandler(async (req, res) => {
  res.send("Transaction Failed");
});

const getPaymentCancelMsg = asyncHandler(async (req, res) => {
  res.send("Transaction was cancelled by user");
});

const getIPN = asyncHandler(async (req, res) => {
  console.log("IPN", req.query);
  res.send(req.query);
});

export { getPaymentSuccessMsg, getPaymentFailMsg, getPaymentCancelMsg, getIPN };
