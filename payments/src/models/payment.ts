import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PaymentAttrs {
  orderId: string;
  paypalId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  paypalId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paypalId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

PaymentSchema.set('versionKey', 'version');
PaymentSchema.plugin(updateIfCurrentPlugin);

PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    paypalId: attrs.paypalId,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  PaymentSchema
);

export { Payment };
