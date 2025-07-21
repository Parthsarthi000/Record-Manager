const pool = require("../database");
module.exports={

    inventory: async (req, res, next) => {
    try {
      const {
        serial_num,
        status,
        organization,
        snapshot,
        model_name,
        product_name,
      } = req.body;

      // Validate required fields
      if (!serial_num || !status || !organization) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const client = await pool.connect();

      // Insert or update current record
      const insertRecordQuery = `
        INSERT INTO records (
    serial_num, status, organization, snapshot,
    model_name, product_name
  )
  VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    status = VALUES(status),
    organization = VALUES(organization),
    snapshot = VALUES(snapshot),
    model_name = VALUES(model_name),
    product_name = VALUES(product_name);
      `;
      const recordValues = [
        serial_num,
        status,
        organization,
        snapshot,
        model_name,
        product_name,
      ];
      await client.query(insertRecordQuery, recordValues);

      // Insert into status_history
      const insertHistoryQuery = `
        INSERT INTO status_history (
          serial_num, status, organization, snapshot,
          model_name, product_name
        )
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      await client.query(insertHistoryQuery, recordValues);

      client.release();

      return res
        .status(201)
        .json({ message: "Inbound record uploaded successfully" });
    } catch (err) {
      console.error("🚨 Error during inbound upload:", err);
      return res.status(500).json({ error: err.message });
    }
  },





  delivery: async (req, res, next) => {
    const serial_num = req.params.serial_num;
    const { status, snapshot, client, organization } = req.body;

    if (!serial_num || (!status && !snapshot && !client && !organization)) {
      return res.status(400).json({ error: "Missing required fields or payload" });
    }

    try {
      const connection = await pool.getConnection();

      // 🔧 Manually written UPDATE query
      const updateQuery = `
        UPDATE records
        SET 
          status = ?,
          snapshot = ?,
          client = ?,
          organization = ?
        WHERE serial_num = ?;
      `;
      await connection.query(updateQuery, [
        status,
        snapshot,
        client,
        organization,
        serial_num,
      ]);

      // 🔍 Fetch updated record
      const [rows] = await connection.query(
        "SELECT * FROM records WHERE serial_num = ?;",
        [serial_num]
      );

      const updatedRecord = rows[0];
      if (!updatedRecord) {
        connection.release();
        return res.status(404).json({ error: "Record not found after update" });
      }

      // 🧾 Manually written INSERT into status_history
      const insertQuery = `
        INSERT INTO status_history (
          serial_num, status, organization, snapshot,
          model_name, product_name, client, location, remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await connection.query(insertQuery, [
        updatedRecord.serial_num,
        updatedRecord.status,
        updatedRecord.organization,
        updatedRecord.snapshot,
        updatedRecord.model_name,
        updatedRecord.product_name,
        updatedRecord.client,
        updatedRecord.location,
        updatedRecord.remarks,
      ]);

      connection.release();
      return res.status(200).json({ message: "Outbound record updated and history logged" });
    } catch (err) {
      console.error("🚨 Error:", err);
      return res.status(500).json({ error: err.message });
    }
  },




  activation: async (req, res, next) => {
    const serial_num = req.params.serial_num;
    const { status, location, snapshot } = req.body;

    if (!serial_num || (!status && !location && !snapshot)) {
      return res.status(400).json({ error: "Missing required fields or payload" });
    }

    try {
      const connection = await pool.getConnection();

      // 🧱 Manually written UPDATE query
      const updateQuery = `
        UPDATE records
        SET 
          status = ?,
          location = ?,
          snapshot = ?
        WHERE serial_num = ?;
      `;
      await connection.query(updateQuery, [
        status,
        location,
        snapshot,
        serial_num,
      ]);

      // 🔍 Select updated record
      const [rows] = await connection.query(
        "SELECT * FROM records WHERE serial_num = ?;",
        [serial_num]
      );
      const updatedRecord = rows[0];
      if (!updatedRecord) {
        connection.release();
        return res.status(404).json({ error: "Record not found after update" });
      }

      // 🧾 Manually written INSERT into status_history
      const insertQuery = `
        INSERT INTO status_history (
          serial_num, status, organization, snapshot,
          model_name, product_name, client, location, remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await connection.query(insertQuery, [
        updatedRecord.serial_num,
        updatedRecord.status,
        updatedRecord.organization,
        updatedRecord.snapshot,
        updatedRecord.model_name,
        updatedRecord.product_name,
        updatedRecord.client,
        updatedRecord.location,
        updatedRecord.remarks,
      ]);

      connection.release();
      return res.status(200).json({ message: "Installation record updated and history logged" });

    } catch (err) {
      console.error("🚨 Error:", err);
      return res.status(500).json({ error: err.message });
    }
  },



   review: async (req, res, next) => {
    const serial_num = req.params.serial_num;
    const { status, remarks, snapshot } = req.body;

    if (!serial_num || (!status && !remarks && !snapshot)) {
      return res.status(400).json({ error: "Missing required fields or payload" });
    }

    try {
      const connection = await pool.getConnection();

      // 🧱 Manually written UPDATE query
      const updateQuery = `
        UPDATE records
        SET 
          status = ?,
          remarks = ?,
          snapshot = ?
        WHERE serial_num = ?;
      `;
      await connection.query(updateQuery, [
        status,
        remarks,
        snapshot,
        serial_num,
      ]);

      // 🔍 Fetch updated record
      const [rows] = await connection.query(
        "SELECT * FROM records WHERE serial_num = ?;",
        [serial_num]
      );
      const updatedRecord = rows[0];
      if (!updatedRecord) {
        connection.release();
        return res.status(404).json({ error: "Record not found after update" });
      }

      // 🧾 Manually written INSERT into status_history
      const insertQuery = `
        INSERT INTO status_history (
          serial_num, status, organization, snapshot,
          model_name, product_name, client, location, remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await connection.query(insertQuery, [
        updatedRecord.serial_num,
        updatedRecord.status,
        updatedRecord.organization,
        updatedRecord.snapshot,
        updatedRecord.model_name,
        updatedRecord.product_name,
        updatedRecord.client,
        updatedRecord.location,
        updatedRecord.remarks,
      ]);

      connection.release();
      return res.status(200).json({ message: "Remarks record updated and history logged" });

    } catch (err) {
      console.error("🚨 Error updating remarks record:", err);
      return res.status(500).json({ error: err.message });
    }
  },




  recordSummary: async (req, res, next) => {
    const serial_num = req.params.serial_num;

    if (!serial_num) {
      return res.status(400).json({ error: "Missing serial number parameter" });
    }

    try {
      const connection = await pool.getConnection();

      const query = `
        SELECT 
          serial_num, 
          status, 
          organization, 
          product_name, 
          model_name
        FROM records
        WHERE serial_num = ?;
      `;
      const [rows] = await connection.query(query, [serial_num]);
      connection.release();

      const row = rows[0];
      if (!row) {
        return res.status(404).json({ error: "Record not found" });
      }

      const record_summary = {
        serial_num: row.serial_num,
        status: row.status,
        organization: row.organization,
        product_name: row.product_name,
        model_name: row.model_name,
      };

      return res.status(200).json(record_summary);

    } catch (err) {
      console.error("🚨 Error fetching record summary:", err);
      return res.status(500).json({ error: err.message });
    }
    },



    fetchRecords: async (req, res, next) => {
    try {
      const connection = await pool.getConnection();

      const query = `
        SELECT 
          serial_num,
          status,
          organization,
          snapshot,
          model_name,
          product_name
        FROM records;
      `;
      const [rows] = await connection.query(query);
      connection.release();

      // 🧱 Build records list manually
      const records = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        records.push({
          serial_num: row.serial_num,
          status: row.status,
          organization: row.organization,
          snapshot: row.snapshot || "",
          model_name: row.model_name,
          product_name: row.product_name,
        });
      }

      return res.status(200).json({ records });

    } catch (err) {
      console.error("🚨 Error fetching records:", err);
      return res.status(500).json({ error: err.message });
    }
    },
};