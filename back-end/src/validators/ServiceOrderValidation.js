import { Exception } from "../exceptions/responseException";
import { findCustomerById } from "../services/CustomerService";
import { findDressmakerById } from "../services/DressmakerService";
import { validateDateOneLessOrEqualThanDateTwo as validateDate } from "../utils/validatorUtils";

export const validateServicesNameAndPrice = (res, services) => {
  if (!services || services.length === 0)
    return Exception(res, 400, "Services are required");

  for (const service of services) {
    if (!service.name || !service.price)
      return Exception(
        res,
        400,
        "Check if all services contains name and price"
      );
  }
  return null;
};

export const validateServiceOrder = async (res, service) => {
  if (!service.entryDate || service.entryDate === "")
    return Exception(res, 400, "Entry date is required");
  if (!service.deliveryDate || service.deliveryDate === "")
    return Exception(res, 400, "Delivery date is required");

  const invalidDate = !validateDate(
    new Date(service.entryDate),
    new Date(service.deliveryDate)
  );

  if (invalidDate) {
    return Exception(res, 400, "Entry and Delivery date are invalid");
  }

  if (!service.deliveryPeriod || service.deliveryPeriod === "")
    return Exception(res, 400, "Delivery period is required");
  if (
    !(service.deliveryPeriod.toUpperCase() === "T") &&
    !(service.deliveryPeriod.toUpperCase() === "M")
  )
    return Exception(res, 400, "Delivery period must be 'T' or 'M'");

  if (service.id) {
    if (!service.statusService || service.statusService === "")
      return Exception(res, 400, "Status service is required");
    if (!validateStatus(service.statusService))
      return Exception(
        res,
        400,
        "Status service must be 'FINISHED' or 'PENDING'"
      );
    if (!service.statusPayment || service.statusPayment === "")
      return Exception(res, 400, "Status payment is required");
  }

  if (!service.customerId || service.customerId === "")
    return Exception(res, 400, "Customer ID is required");
  if ((await findCustomerById(service.customerId)) === null)
    return Exception(res, 400, "Customer not found");

  if (!service.dressmakerId || service.dressmakerId === "")
    return Exception(res, 400, "Dressmaker ID is required");
  if ((await findDressmakerById(service.dressmakerId)) === null)
    return Exception(res, 400, "Dressmaker not found");

  return null;
};

export const validateStatus = (status) => {
  if (
    !(status.toUpperCase() === "FINISHED") &&
    !(status.toUpperCase() === "PENDING")
  )
    return false;
  return true;
};
