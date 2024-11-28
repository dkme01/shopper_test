import { findDriverById } from "../../services/ride/drivers";
import { findRidesByCustomerId } from "../../services/ride/list";
import { Request, Response } from 'express';

export const listAllRides = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    console.log('Received customer_id:', customer_id);
    console.log('Received driver_id:', driver_id);

    // Validate customer_id
    if (!customer_id) {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Customer ID cannot be blank'
      });
      return
    }

    const parsedDriverId = driver_id ? driver_id as string: undefined;
    const driver = findDriverById(parsedDriverId)

    if (parsedDriverId !== undefined) {
      if (!driver) {
        res.status(400).json({
          error_code: 'INVALID_DRIVER',
          error_description: "Motorista inválido"
        });
        return
      }
    }

    let ridesList = findRidesByCustomerId(
      customer_id,
      parsedDriverId
    );

    if (!ridesList || ridesList.length === 0) {
      res.status(404).json({
        error_code: 'NO_RIDES_FOUND',
        error_description: "Nenhum registro encontrado"
      });
      return
    }


    res.status(200).json({
      description: "Operação realizada com sucesso",
      customer_id,
      rides: ridesList.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: error.message
      });
    } else {
      res.status(500).json({
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'An unexpected error occurred'
      });
    }
  }
};
