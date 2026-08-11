from flask import Flask, request, jsonify
from flask_cors import CORS
import razorpay
import os
import hmac
import hashlib
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

KEY_ID = os.getenv("RAZORPAY_KEY_ID")
KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

if not KEY_ID or not KEY_SECRET:
    raise ValueError("Razorpay API keys are missing")

client = razorpay.Client(
    auth=(KEY_ID, KEY_SECRET)
)


@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "Food Express payment server is running"
    })


@app.route("/create-order", methods=["POST"])
def create_order():

    try:

        data = request.get_json()

        amount = int(data.get("amount", 0))

        if amount <= 0:
            return jsonify({
                "success": False,
                "message": "Invalid amount"
            }), 400

        if amount > 50000000:
            return jsonify({
                "success": False,
                "message": "Amount is too large"
            }), 400

        order_data = {
            "amount": amount,
            "currency": "INR",
            "receipt": "food_express_order",
            "payment_capture": 1
        }

        order = client.order.create(
            data=order_data
        )

        return jsonify({
            "success": True,
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": KEY_ID
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route("/verify-payment", methods=["POST"])
def verify_payment():

    try:

        data = request.get_json()

        razorpay_order_id = data.get(
            "razorpay_order_id"
        )

        razorpay_payment_id = data.get(
            "razorpay_payment_id"
        )

        razorpay_signature = data.get(
            "razorpay_signature"
        )

        if not all([
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        ]):

            return jsonify({
                "success": False,
                "message": "Missing payment details"
            }), 400


        message = (
            razorpay_order_id
            + "|"
            + razorpay_payment_id
        )


        generated_signature = hmac.new(
            KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()


        if hmac.compare_digest(
            generated_signature,
            razorpay_signature
        ):

            return jsonify({
                "success": True,
                "message": "Payment verified successfully"
            })


        return jsonify({
            "success": False,
            "message": "Payment verification failed"
        }), 400


    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )