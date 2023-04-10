const DB = require("mongoose");

function connect() {
  DB.connect(
    `mongodb+srv://chat:cRKiRzs6v78GNDOm@demo.739ksc9.mongodb.net/chat`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
    .then((conn: any) =>
      console.log(
        `MongoDB Connected: ${conn.connection.name} ${conn.connection.host} ${conn.connection.port}`
      )
    )
    .catch((error: any) => console.log(error));
}

export default { connect };
