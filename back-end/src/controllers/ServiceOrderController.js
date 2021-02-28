import { Exception } from "../exceptions/responseException";
import models from "../models";
import {
  getSelectorQuery,
  getServiceOrder,
  getTotalPrice,
  storeServices
} from "../services/ServiceOrderService";
import {
  validateServiceOrder,
  validateServicesNameAndPrice
} from "../validators/ServiceOrderValidation";

const { Op } = require("sequelize");

const index = async (req, res) => {
  try {
    const orderByPrice = req.query.orderByPrice;

    const limit = req.query.limit;
    const offset = req.query.offset;

    const status = req.query.status;

    const dateField = req.query.dateField;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const selector = getSelectorQuery(
      orderByPrice,
      limit,
      offset,
      status,
      dateField,
      startDate,
      endDate
    );
    console.log(selector);

    let serviceOrders = await models.ServiceOrder.findAndCountAll(selector);

    for (const element of serviceOrders.rows)
      await getServiceOrder(element.dataValues);

    return res.json(serviceOrders);
  } catch (error) {
    return Exception(res, 500, "Error to retrieve Service Order");
  }
};

const findByCustomerId = async (req, res) => {
  const customerId = req.params.id;

  try {
    const orderByPrice = req.query.orderByPrice;

    const limit = req.query.limit;
    const offset = req.query.offset;

    const status = req.query.status;

    const dateField = req.query.dateField;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let selector = getSelectorQuery(
      orderByPrice,
      limit,
      offset,
      status,
      dateField,
      startDate,
      endDate
    );
    selector.where[Op.and].push({
      ["customerId"]: customerId,
    });
    console.log(selector);

    let serviceOrders = await models.ServiceOrder.findAndCountAll(selector);

    for (const element of serviceOrders.rows)
      await getServiceOrder(element.dataValues);

    return res.json(serviceOrders);
  } catch (error) {
    return Exception(res, 500, "Error to retrieve Service Order");
  }
};

const findByDressMakerId = async (req, res) => {
  const dressmakerId = req.params.id;

  try {
    const orderByPrice = req.query.orderByPrice;

    const limit = req.query.limit;
    const offset = req.query.offset;

    const status = req.query.status;

    const dateField = req.query.dateField;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let selector = getSelectorQuery(
      orderByPrice,
      limit,
      offset,
      status,
      dateField,
      startDate,
      endDate
    );
    selector.where[Op.and].push({
      ["dressmakerId"]: dressmakerId,
    });
    console.log(selector);

    let serviceOrders = await models.ServiceOrder.findAndCountAll(selector);

    for (const element of serviceOrders.rows)
      await getServiceOrder(element.dataValues);

    return res.json(serviceOrders);
  } catch (error) {
    return Exception(res, 500, "Error to retrieve Service Order");
  }
};

const findByCustomerAndDressmakerId = async (req, res) => {
  const dressmakerId = req.params.dressmakerId;
  const customerId = req.params.customerId;

  try {
    const orderByPrice = req.query.orderByPrice;

    const limit = req.query.limit;
    const offset = req.query.offset;

    const status = req.query.status;

    const dateField = req.query.dateField;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let selector = getSelectorQuery(
      orderByPrice,
      limit,
      offset,
      status,
      dateField,
      startDate,
      endDate
    );
    selector.where[Op.and].push({
      ["customerId"]: customerId,
    });
    selector.where[Op.and].push({
      ["dressmakerId"]: dressmakerId,
    });
    console.log(selector);

    let serviceOrders = await models.ServiceOrder.findAndCountAll(selector);

    for (const element of serviceOrders.rows)
      await getServiceOrder(element.dataValues);

    return res.json(serviceOrders);
  } catch (error) {
    return Exception(res, 500, "Error to retrieve Service Order");
  }
};

const findById = async (req, res) => {
  const idRequest = parseInt(req.params.id);
  try {
    let serviceOrderFound = await models.ServiceOrder.findByPk(idRequest, {
      include: ["services"],
    });

    if (!serviceOrderFound)
      return Exception(res, 404, `Service Order ${idRequest} not found`);
    serviceOrderFound = await getServiceOrder(serviceOrderFound.dataValues);
    return res.json(serviceOrderFound);
  } catch (error) {
    return Exception(res, 500, "Error to retrieve Service Order");
  }
};

const findByIdAndDressmakerId = async (req, res) => {
  const serviceOrderId = parseInt(req.params.id);
  const dressmakerId = req.params.dressmakerId;

  const selector = { id: serviceOrderId, dressmakerId: dressmakerId };

  try {
    const serviceOrderFound = await models.ServiceOrder.findOne({
      include: [
        {
          model: models.Service,
          as: "services",
        },
      ],
      where: selector,
    });

    if (!serviceOrderFound)
      return Exception(res, 404, `Service Order ${serviceOrderId} not found`);

    await getServiceOrder(serviceOrderFound.dataValues);

    return res.json(serviceOrderFound);
  } catch (error) {
    console.log(error);
    return Exception(res, 500, "Error to retrieve Service Order");
  }
};

const findByIdAndCustomerId = async (req, res) => {
  const serviceOrderId = parseInt(req.params.id);
  const customerId = req.params.customerId;

  console.log(serviceOrderId);

  const selector = { id: serviceOrderId, customerId: customerId };

  try {
    const serviceOrderFound = await models.ServiceOrder.findOne({
      include: [
        {
          model: models.Service,
          as: "services",
        },
      ],
      where: selector,
    });

    if (!serviceOrderFound)
      return Exception(res, 404, `Service Order ${serviceOrderId} not found`);

    await getServiceOrder(serviceOrderFound.dataValues);

    return res.json(serviceOrderFound);
  } catch (error) {
    return Exception(res, 500, "Error to retrieve Service Order");
  }
};

const findByIdAndCustomerAndDressmakerId = async (req, res) => {
  const serviceOrderId = parseInt(req.params.id);
  const dressmakerId = req.params.dressmakerId;
  const customerId = req.params.customerId;

  console.log(serviceOrderId);

  const selector = {
    id: serviceOrderId,
    dressmakerId: dressmakerId,
    customerId: customerId,
  };

  try {
    const serviceOrderFound = await models.ServiceOrder.findOne({
      include: [
        {
          model: models.Service,
          as: "services",
        },
      ],
      where: selector,
    });

    if (!serviceOrderFound)
      return Exception(res, 404, `Service Order ${serviceOrderId} not found`);

    await getServiceOrder(serviceOrderFound.dataValues);

    return res.json(serviceOrderFound);
  } catch (error) {
    return Exception(res, 500, "Error to retrieve Service Order");
  }
};

const store = async (req, res) => {
  const {
    entryDate,
    deliveryDate,
    deliveryPeriod,
    services,
    customerId,
    dressmakerId,
  } = req.body;
  const serviceOrder = {
    deliveryDate,
    entryDate,
    deliveryPeriod,
    statusService: "PENDING",
    statusPayment: false,
    customerId,
    dressmakerId,
  };
  let error = await validateServicesNameAndPrice(res, services);
  if (error) return error;
  error = await validateServiceOrder(res, serviceOrder);
  if (error) return error;

  serviceOrder["totalPrice"] = getTotalPrice(services);

  try {
    const result = await models.ServiceOrder.create(serviceOrder);
    await storeServices(result.id, services);
    return res.status(201).json(result);
  } catch (error) {
    return Exception(res, 500, "Error to create new Service Order");
  }
};

const update = async (req, res) => {
  const {
    id,
    entryDate,
    deliveryDate,
    deliveryPeriod,
    totalPrice,
    statusService,
    statusPayment,
    services,
    customerId,
    dressmakerId,
  } = req.body;
  const idRequest = req.params.id;

  console.log(idRequest, id);

  if (parseInt(idRequest) !== id)
    return Exception(res, 400, "Path ID and payload ID does not matches");

  if (!(await models.ServiceOrder.findOne({ where: { id: id } })))
    return Exception(res, 404, "Service Order not found");

  const serviceOrder = {
    id,
    entryDate,
    deliveryDate,
    deliveryPeriod,
    totalPrice,
    statusService,
    statusPayment,
    customerId,
    dressmakerId,
  };

  let error = await validateServicesNameAndPrice(res, services);
  if (error) return error;

  error = await validateServiceOrder(res, serviceOrder);
  if (error) return error;

  await deleteOldServices(id, services);
  await storeServices(id, services);
  const servicesDB = await models.Service.findAll({
    where: { serviceOrderId: id },
  });
  serviceOrder["totalPrice"] = getTotalPrice(servicesDB);

  try {
    await models.ServiceOrder.update(serviceOrder, { where: { id: id } });
    return res.status(200).json(serviceOrder);
  } catch (error) {
    console.log(error);
    return Exception(res, 500, "Error to update Service Order");
  }
};

const destroy = async (req, res) => {
  const idRequest = parseInt(req.params.id);

  let serviceOrderFound = await models.ServiceOrder.findOne({
    include: [
      {
        model: models.Service,
        as: "services",
      },
    ],
    where: { id: idRequest },
  });
  if (!serviceOrderFound) return Exception(res, 404, "Service Order not found");

  try {
    serviceOrderFound = await getServiceOrder(serviceOrderFound.dataValues);
    await models.ServiceOrder.destroy({ where: { id: idRequest } });

    if (serviceOrderFound.services) {
      console.log(serviceOrderFound.services);
      for (const service of serviceOrderFound.services) {
        await models.Service.destroy({ where: { id: service.dataValues.id } });
      }
    }
    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return Exception(res, 500, "Error to remove Service Order");
  }
};

export default {
  index,
  findById,
  findByCustomerId,
  findByDressMakerId,
  findByCustomerAndDressmakerId,
  findByIdAndCustomerId,
  findByIdAndDressmakerId,
  findByIdAndCustomerAndDressmakerId,
  store,
  update,
  destroy,
};
