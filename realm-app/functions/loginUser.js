exports = async function (loginPayload) {
  const users = context.services
    .get('mongodb-atlas')
    .db('SmartFactory')
    .collection('users');
  const { email, _partition, token } = loginPayload;
  const user = await users.findOne({ email });
  if (user) {
    return user._id.toString();
  } else {
    const result = await users.insertOne({
      email,
      _partition,
      token,
      createdAt: new Date(),
    });
    return result.insertedId.toString();
  }
};
