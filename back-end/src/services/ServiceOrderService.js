import { Exception } from "../exceptions/responseException";
import models from "../models";
import { validateStatus } from "../validators/ServiceOrderValidation";

export const getSelectorQuery = (
  orderByPrice,
  limit,
  offset,
  status,
  dateField,
  startDate,
  endDate
) => {
  let selector = {
    order: orderByPrice ? [["totalPrice", orderByPrice.toUpperCase()]] : [],
    include: ["services"],
    limit: limit,
    offset: offset,
  };

  const validDateFilter = startDate && endDate && dateField;

  if (status || validDateFilter) selector["where"] = { [Op.and]: [] };

  if (status && validateStatus(status)) {
    selector.where[Op.and].push({ status: status });
  } else {
    return Exception(res, 400, "Wrong status!");
  }

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const startDateLessThanEndDate = startDate.getTime() < endDate.getTime();
  const startDateEqualsToEndDate = startDate.getTime() === endDate.getTime();

  if (validDateFilter && startDateLessThanEndDate) {
    selector.where[Op.and].push({
      [dateField]: {
        [Op.between]: [startDate, endDate],
      },
    });
  } else if (validDateFilter && startDateEqualsToEndDate) {
    selector.where[Op.and].push({
      [dateField]: startDate,
    });
  }

  return selector;
};

export const getServiceOrder = async (data) => {
  const customer = await models.Customer.findOne({
    where: { id: data.customerId, active: true },
  });
  const dressmaker = await models.Dressmaker.findOne({
    where: { id: data.dressmakerId, active: true },
  });

  data["customer"] = { id: customer.id, name: customer.name };
  delete data.customerId;

  data["dressmaker"] = { id: dressmaker.id, name: dressmaker.name };
  delete data.dressmakerId;

  return data;
};

export const getTotalPrice = (services) => {
  const totalPrice = services
    .map((elem) => elem.price)
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });
  return totalPrice;
};

export const deleteOldServices = async (idServiceOrder, services) => {
  const servicesDB = await models.Service.findAll({
    where: { serviceOrderId: idServiceOrder },
  });

  const servicesIdDB = servicesDB.map((service) => service.id);
  const servicesId = services
    .filter((elem) => elem.id)
    .map((service) => service.id);

  const servicesIdFiltered = servicesIdDB.filter(
    (id) => !servicesId.includes(id)
  );

  if (servicesIdFiltered.length !== 0) {
    servicesIdFiltered.forEach(async (id) => {
      await models.Service.destroy({ where: { id: id } });
    });
  }
};

export const storeServices = async (serviceOrderId, services) => {
  for (const service of services) {
    service.serviceOrderId = serviceOrderId;
    if (!service.id) await models.Service.create(service);
    else {
      if (await models.Service.findOne({ where: { id: service.id } }))
        await models.Service.update(service, { where: { id: service.id } });
    }
  }
};
