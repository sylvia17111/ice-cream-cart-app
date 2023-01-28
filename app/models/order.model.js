module.exports = mongoose => {
    const IceCreamOrder = mongoose.model(
      "icecreamorder",
      mongoose.Schema(
        {
          user: String,
          paymentAmount: Number,
          base: String,
          flavours: {
            type: Map,
            of: String
          }
        },
        { timestamps: true }
      )
    );
  
    return IceCreamOrder;
  };
  