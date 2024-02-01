import { isValid, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const currentDate = new Date()

export function formatDate(date = currentDate) {
  const newDate = format(new Date(date), "dd/MM/yyyy", {
    locale: ptBR
  })

  return newDate
}

export function formatDateTime(date = currentDate) {
  const newDate = format(new Date(date), 'dd/MM HH:mm', {
    locale: ptBR,
  });

  return newDate;
}

export function formatTime(date = currentDate) {
  const newDate = format(new Date(date), 'HH:mm:ss', {
    locale: ptBR,
  });

  return newDate;
}

export function validateDate(date) {
  return (isValid(new Date(date)) && date.length >= 10);
}
