const { UserModel } = require("../models/user-model");

const getCategories = async (req, res) => {
  try {
    const users = await UserModel.find().select('category');
    const categories = [...new Set(users.map(user => {
        if(user.role==="admin") return user.category
  }))]
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories };
