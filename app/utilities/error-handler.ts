import { NotificationInstance } from "antd/es/notification/interface";
import { ApiError } from "../models/error";


export function handleApiError(error: unknown, notificationApi:NotificationInstance) 
{
  if (!(error instanceof ApiError)) 
  {
    notificationApi.error({
        message:"Error",
        description:"Something went wrong"
    });
    return;
  }

  if (typeof error.details === "object" && error.details !== null) 
  {
    Object.entries(error.details).forEach(([field, message]) => 
        {
            notificationApi.error(
            {
                message:`${field} error`,
                description:message
            }
        );
        }
    );
  } 
  else 
  {
    notificationApi.error({
        message:error.message,
        description:error.details
    });
  }
}