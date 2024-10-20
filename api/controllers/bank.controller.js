import { PgConnect } from "../utils/config.js";
import errorHandler from "../utils/error.js";

export const getDatas = async (req, res, next) => {
  const pool = PgConnect();

  try {
    const sortDirection = req.query.sort === "asc" ? "ASC" : "DESC";
    const month = req.query.month;
    const limit = parseInt(req.query.limit) || 10;
    let query = `SELECT b.id, b.age, b.job, b.marital, b.education, b.balance, b.housing, b.loan, b.day, b.month, c.name, c.email, c.gender
    FROM bank_info b
    JOIN bank_customer c ON b.id = c.bank_id`;

    let queryParams = []; // ใช้สำหรับแทนค่า $1, $2

    // กรองข้อมูลตามเดือน
    if (month && month !== "all") {
      query += ` WHERE month = $1`;
      queryParams.push(month);
    }

    // กรองข้อมูลตามช่วงอายุ
    if (req.query.ageRange && req.query.ageRange !== "all") {
      const [minAge, maxAge] = req.query.ageRange.split("-");
      if (queryParams.length > 0) {
        query += ` AND age BETWEEN $${queryParams.length + 1} AND $${
          queryParams.length + 2
        }`; // ใช้เลขดัชนีสำหรับพารามิเตอร์
        queryParams.push(minAge, maxAge);
      } else {
        query += ` WHERE age BETWEEN $1 AND $2`; // สำหรับกรณีที่ไม่มีเงื่อนไขอื่นก่อนหน้า
        queryParams.push(minAge, maxAge);
      }
    }

    if (req.query.searchTerm && req.query.searchTerm.trim()) {
      const searchTerm = `%${req.query.searchTerm}%`;
      query += queryParams.length > 0 ? ` AND` : ` WHERE`;
      query += ` (job ILIKE $${queryParams.length + 1} OR marital ILIKE $${
        queryParams.length + 2
      })`;
      queryParams.push(searchTerm, searchTerm);
    }

    // เรียงลำดับข้อมูลตาม id
    query += ` ORDER BY id ${sortDirection}`;
    // Query ข้อมูลทั้งหมด
    const fullResult = await pool.query(query, queryParams);

    // Query ข้อมูลตัวอย่างโดยใช้ LIMIT
    const previewQuery = query + ` LIMIT $${queryParams.length + 1}`; // เพิ่ม LIMIT ที่ท้าย query
    const previewParams = [...queryParams, limit]; // เพิ่มค่าจำกัดจำนวน (LIMIT) ใน queryParams
    const previewResult = await pool.query(previewQuery, previewParams);

    const totalDatas = fullResult.rowCount;
    const bankDatas = fullResult.rows; // ข้อมูลทั้งหมด
    const previewDatas = previewResult.rows; // ข้อมูลที่จำกัดตาม LIMIT

    // ส่งข้อมูลทั้งหมดและข้อมูลที่จำกัดจำนวนกลับไปยัง client
    res.status(200).json({
      totalDatas: totalDatas,
      bankDatas: bankDatas,
      previewDatas: previewDatas,
    });
  } catch (error) {
    next(error);
  } finally {
    await pool.end();
  }
};

export const getDetails = async (req, res, next) => {
  const pool = PgConnect();
  try {
    let label = req.query.label;

    let query = `SELECT * FROM bank_info b JOIN bank_customer c ON b.id = c.bank_id`;
    let queryParams = [];

    if (label) {
      label = label.toLowerCase();
      query += ` WHERE b.job = $1`;
      queryParams.push(label);
    }

    query += ` ORDER BY b.id`;

    const fullResult = await pool.query(query, queryParams);

    const totalDatas = fullResult.rowCount;
    const bankDatas = fullResult.rows; // ข้อมูลทั้งหมด

    res.status(200).json({
      message: "ok",
      totalDatas: totalDatas,
      bankDatas: bankDatas,
      label: label,
    });
  } catch (error) {
    next(error);
  } finally {
    await pool.end();
  }
};

export const createData = async (req, res, next) => {
  let {
    firstname,
    lastname,
    email,
    gender,
    age,
    job,
    otherJob,
    marital,
    education,
    balance,
    housing,
    loan,
    defaultCredit,
    contact_type,
    duration,
    pdays,
    campaign,
    pcontact,
    poutcome,
    deposit,
  } = req.body;

  // Trim whitespace for all string fields
  firstname = firstname?.trim();
  lastname = lastname?.trim();
  email = email?.trim();
  otherJob = otherJob?.trim();
  marital = marital?.trim();
  education = education?.trim();

  age = Number(age);
  balance = Number(balance);
  duration = Number(duration);
  campaign = Number(campaign);
  pcontact = Number(pcontact);
  poutcome = Number(poutcome);

  // ตรวจสอบค่าที่จำเป็น
  if (
    !firstname ||
    !lastname ||
    !email ||
    !gender ||
    !age ||
    isNaN(age) ||
    !job ||
    !otherJob ||
    !marital ||
    !education ||
    !balance ||
    isNaN(balance) ||
    !housing ||
    !loan ||
    !defaultCredit ||
    !contact_type ||
    isNaN(pdays) ||
    isNaN(duration) ||
    isNaN(campaign) ||
    isNaN(pcontact) ||
    isNaN(poutcome) ||
    !deposit
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  const fullName = firstname + " " + lastname;

  if (job === "other") {
    job = otherJob.toLowerCase();
  }

  //set poutcome
  poutcome = String(poutcome);
  //set Date
  const nowDate = new Date();
  const day = nowDate.getDate();
  let month = nowDate.getMonth() + 1;

  switch (month) {
    case 1:
      month = "jan";
      break;
    case 2:
      month = "feb";
      break;
    case 3:
      month = "mar";
      break;
    case 4:
      month = "apr";
      break;
    case 5:
      month = "may";
      break;
    case 6:
      month = "jun";
      break;
    case 7:
      month = "jul";
      break;
    case 8:
      month = "aug";
      break;
    case 9:
      month = "sep";
      break;
    case 10:
      month = "oct";
      break;
    case 11:
      month = "nov";
      break;
    case 12:
      month = "dec";
      break;
    default:
      month = "Invalid month";
  }

  let pool = await PgConnect();

  try {
    await pool.query(`BEGIN`);

    const bankResult = await pool.query(
      `INSERT INTO bank_info (age, job, marital, education, "default", balance, housing, loan, contact, day, month, duration, campaign, pdays, previous, poutcome, y) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,
      [
        age,
        job,
        marital,
        education,
        defaultCredit,
        balance,
        housing,
        loan,
        contact_type,
        day,
        month,
        duration,
        campaign,
        pdays,
        pcontact,
        poutcome,
        deposit,
      ]
    );

    const bankId = bankResult.rows[0].id;

    await pool.query(
      "INSERT INTO bank_customer (name, email, gender, bank_id) VALUES ($1, $2, $3, $4)",
      [fullName, email, gender, bankId]
    );

    await pool.query("COMMIT");

    res.status(201).json({ message: "Data created successfully" });
  } catch (error) {
    await pool.query("ROLLBACK"); // Rollback transaction หากเกิดข้อผิดพลาด
    next(errorHandler(500, error));
  } finally {
    pool.end();
  }
};
