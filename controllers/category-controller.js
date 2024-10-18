const { UserModel } = require("../models/user-model");

const getCategories = async (req, res) => {
  try {
    const users = await UserModel.find().select('category role');

    const categories = [...new Set(users
      .filter(user => user.role==="admin")
      .map(user => user.category)
    )];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories };
