import mongoose from 'mongoose';

interface ticketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface ticketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

interface ticketModel extends mongoose.Model<ticketDoc> {
  build(attrs: ticketAttrs): ticketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
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

ticketSchema.statics.build = (attrs: ticketAttrs): ticketDoc => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<ticketDoc, ticketModel>('Ticket', ticketSchema);

export { Ticket };
