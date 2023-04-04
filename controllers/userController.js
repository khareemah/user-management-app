const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { NotFoundError } = require('../errors');

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};

const getAllUsers = async (req, res) => {
  const {
    sort,
    numericFilters,
    gender,
    maritalStatus,
    firstName,
    lastName,
  } = req.query;
z
  const queryObject = {};
  if (firstName) {
    queryObject.firstName = { $regex: `^${firstName}$`, $options: 'i' };
  }
  if (lastName) {
    queryObject.lastName = { $regex: `^${lastName}$`, $options: 'i' };
  }

  if (maritalStatus) {
    queryObject.maritalStatus = { $regex: maritalStatus, $options: 'i' };
  }
  if (gender) {
    //  const regex = new RegExp(`^${gender}$`, 'i');
    // queryObject.gender = { $regex: regex };
    //  queryObject.gender = { $regex: /^male$/i };
    queryObject.gender = { $regex: `^${gender}$`, $options: 'i' };
  }

  // filter by age
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ['age'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = User.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('-age');
  }

  const users = await result;
  res.status(StatusCodes.OK).json({ nbUsers: users.length, users });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findByIdAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findByIdAndRemove({ _id: userId });
  if (!user) {
    throw new NotFoundError(`No user with id ${userId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
