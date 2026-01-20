const Notification = require("../models/notification.model");

exports.createNotification = async ({
  userId,
  type,
  message,
  metadata = {},
}) => {
  const notification = new Notification({
    userId,
    type,
    message,
    metaData: metadata,
  });

  await notification.save();
  return notification;
};
