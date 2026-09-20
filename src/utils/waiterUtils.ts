import { KDSTicket, KDSTicketItem, TableItem, DrinkOrder } from '../types';

/**
 * Checks if a waiter name is generic or unassigned (e.g. 'Mozo de Turno', 'Sin asignar', empty).
 * Any order or table with a generic waiter is accessible and claimable by any active waiter on duty.
 */
export const isGenericWaiter = (waiterName?: string): boolean => {
  if (!waiterName) return true;
  const w = waiterName.toLowerCase().trim();
  return (
    w === '' ||
    w === 'sin asignar' ||
    w === 'mozo de turno' ||
    w === 'mozo' ||
    w === 'mesero' ||
    w === 'personal' ||
    w === 'personal de turno' ||
    w === 'en blanco' ||
    w === 'sin mozo' ||
    w.includes('sin asignar') ||
    w.includes('de turno')
  );
};

/**
 * Checks if two waiter names refer to the same person (case-insensitive, first name match).
 */
export const isWaiterMatch = (waiterA?: string, waiterB?: string): boolean => {
  if (!waiterA || !waiterB) return false;
  const a = waiterA.toLowerCase().trim();
  const b = waiterB.toLowerCase().trim();
  if (!a || !b) return false;
  if (a === b) return true;
  const aFirst = a.split(' ')[0];
  const bFirst = b.split(' ')[0];
  return (
    (aFirst && b.includes(aFirst)) ||
    (bFirst && a.includes(bFirst))
  );
};

/**
 * Checks if a ticket's table description (e.g. "Mesa 04 (4 personas)", "Mesa 04", "04")
 * corresponds to a specific table number or ID.
 */
export const matchesTable = (ticketTableStr?: string, tableNumber?: string, tableId?: string): boolean => {
  if (!ticketTableStr) return false;
  const tStr = ticketTableStr.toLowerCase().trim();

  // Match by tableId (e.g. "mesa-04" -> matches "mesa 04 (4 personas)", "mesa-04", or by digits 04)
  if (tableId) {
    const idLower = tableId.toLowerCase().trim();
    if (tStr.includes(idLower)) return true;
    const idSpaced = idLower.replace(/[-_]/g, ' ');
    if (tStr.includes(idSpaced)) return true;
    const idDigits = idLower.match(/\d+/);
    const ticketDigits = tStr.match(/\d+/);
    if (idDigits && ticketDigits && parseInt(idDigits[0], 10) === parseInt(ticketDigits[0], 10)) {
      return true;
    }
  }

  if (tableNumber) {
    const numClean = tableNumber.replace(/\D/g, '');
    if (tStr.includes(`mesa ${tableNumber.toLowerCase()}`)) return true;
    if (numClean && tStr.includes(`mesa ${numClean}`)) return true;

    // Check if the ticket string starts with or contains the exact number
    const matchDigits = tStr.match(/\d+/);
    if (matchDigits && numClean && parseInt(matchDigits[0], 10) === parseInt(numClean, 10)) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if a table belongs to the active waiter:
 * - If table has no waiter or generic waiter ('Mozo de Turno'), any active waiter on duty can attend it.
 * - If assigned to a specific waiter, only that waiter matches.
 */
export const isTableAssignedToWaiter = (
  table: TableItem,
  currentUserName?: string,
  isWaiterRole: boolean = true
): boolean => {
  if (!table.waiter || isGenericWaiter(table.waiter)) {
    return isWaiterRole;
  }
  return isWaiterMatch(table.waiter, currentUserName);
};

/**
 * Determines whether a KDS ticket belongs to the current waiter:
 * 1. If ticket has a specific waiter matching current user -> true
 * 2. If ticket matches a table assigned to current user in salon -> true
 * 3. If ticket waiter is generic ('Mozo de Turno') and salon table is unassigned/generic -> true (any waiter on duty)
 */
export const isTicketAssignedToWaiter = (
  ticket: KDSTicket,
  currentUserName?: string,
  tables: TableItem[] = []
): boolean => {
  if (!currentUserName) return true;

  // 1. Direct waiter match on ticket
  if (ticket.waiter && !isGenericWaiter(ticket.waiter)) {
    if (isWaiterMatch(ticket.waiter, currentUserName)) {
      return true;
    }
  }

  // 2. Salon table assignment match
  const matchedTable = tables.find((tbl) => matchesTable(ticket.table, tbl.number, tbl.id));
  if (matchedTable) {
    if (matchedTable.waiter && !isGenericWaiter(matchedTable.waiter)) {
      return isWaiterMatch(matchedTable.waiter, currentUserName);
    }
    // Table is unassigned or generic -> claimable by any active waiter
    return true;
  }

  // 3. Generic ticket waiter with no specific table conflict
  if (isGenericWaiter(ticket.waiter)) {
    return true;
  }

  return false;
};

/**
 * Identifies whether an item in a KDS ticket is a drink / beverage.
 */
export const isDrinkKDSTicketItem = (item: KDSTicketItem): boolean => {
  const substation = (item.substation || '').toUpperCase();
  const station = ((item as any).station || '').toLowerCase();
  const category = ((item as any).category || '').toLowerCase();
  const name = (item.name || '').toLowerCase();

  return (
    substation.includes('BEB') ||
    station.includes('beb') ||
    station.includes('barra') ||
    category.includes('beb') ||
    category.includes('cerveza') ||
    category.includes('gaseosa') ||
    category.includes('refresco') ||
    Boolean((item as any).isDrink) ||
    name.includes('bebida') ||
    name.includes('chicha') ||
    name.includes('maracuyá') ||
    name.includes('maracuya') ||
    name.includes('limonada') ||
    name.includes('gaseosa') ||
    name.includes('cerveza') ||
    name.includes('inka kola') ||
    name.includes('coca cola') ||
    name.includes('agua ')
  );
};

/**
 * Extracts drink orders from KDS tickets for a given table.
 */
export const extractDrinksFromTickets = (
  tickets: KDSTicket[],
  tableNumber: string,
  tableId?: string
): DrinkOrder[] => {
  const result: DrinkOrder[] = [];

  for (const ticket of tickets) {
    if (ticket.status === 'served') continue;
    if (!matchesTable(ticket.table, tableNumber, tableId)) continue;

    ticket.items.forEach((item, index) => {
      if (isDrinkKDSTicketItem(item)) {
        const isServed = Boolean(item.isServed || (item as any).status === 'served');
        result.push({
          id: item.id || `ticket-drk-${ticket.id}-${index}`,
          name: item.name,
          qty: item.qty || 1,
          price: item.price || 0,
          served: isServed,
          servedAt: item.servedAt
        });
      }
    });
  }

  return result;
};
