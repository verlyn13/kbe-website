import { PrismaClient, type Program } from '@prisma/client';

const prisma = new PrismaClient();

// Calendar event type based on Program data
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  category: string;
  location?: string;
  recurring?: boolean;
  recurringSchedule?: any; // JSON field from Program.schedule
  programId?: string;
  type: 'program' | 'event' | 'holiday';
}

export const calendarService = {
  /**
   * Get all calendar events (programs and their schedules)
   */
  async getAll(): Promise<CalendarEvent[]> {
    const programs = await prisma.program.findMany({
      orderBy: { startDate: 'asc' },
    });

    return this.programsToEvents(programs);
  },

  /**
   * Get events for a specific date range
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const programs = await prisma.program.findMany({
      where: {
        OR: [
          // Programs that start within the range
          {
            startDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          // Programs that end within the range
          {
            endDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          // Programs that span the entire range
          {
            AND: [{ startDate: { lte: startDate } }, { endDate: { gte: endDate } }],
          },
        ],
      },
      orderBy: { startDate: 'asc' },
    });

    return this.programsToEvents(programs);
  },

  /**
   * Get events for a specific month
   */
  async getByMonth(year: number, month: number): Promise<CalendarEvent[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    return this.getByDateRange(startDate, endDate);
  },

  /**
   * Get upcoming events
   */
  async getUpcoming(limit = 10): Promise<CalendarEvent[]> {
    const now = new Date();
    const programs = await prisma.program.findMany({
      where: {
        endDate: { gte: now },
      },
      orderBy: { startDate: 'asc' },
      take: limit,
    });

    return this.programsToEvents(programs);
  },

  /**
   * Get event by ID
   */
  async getById(id: string): Promise<CalendarEvent | null> {
    const program = await prisma.program.findUnique({
      where: { id },
    });

    if (!program) return null;

    return this.programToEvent(program);
  },

  /**
   * Create a new calendar event (as a program)
   */
  async create(data: {
    title: string;
    description: string;
    start: Date;
    end: Date;
    category: string;
    location?: string;
    capacity?: number;
    price?: number;
    schedule?: any;
  }): Promise<CalendarEvent> {
    const program = await prisma.program.create({
      data: {
        name: data.title,
        description: data.description,
        startDate: data.start,
        endDate: data.end,
        category: data.category,
        schedule: data.schedule || {},
        capacity: data.capacity || 0,
        price: data.price || 0,
      },
    });

    return this.programToEvent(program);
  },

  /**
   * Update a calendar event
   */
  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      start?: Date;
      end?: Date;
      category?: string;
      schedule?: any;
    }
  ): Promise<CalendarEvent> {
    const program = await prisma.program.update({
      where: { id },
      data: {
        name: data.title,
        description: data.description,
        startDate: data.start,
        endDate: data.end,
        category: data.category,
        schedule: data.schedule,
      },
    });

    return this.programToEvent(program);
  },

  /**
   * Delete a calendar event
   */
  async delete(id: string): Promise<void> {
    await prisma.program.delete({
      where: { id },
    });
  },

  /**
   * Get events by category
   */
  async getByCategory(category: string): Promise<CalendarEvent[]> {
    const programs = await prisma.program.findMany({
      where: { category },
      orderBy: { startDate: 'asc' },
    });

    return this.programsToEvents(programs);
  },

  /**
   * Generate recurring events from a program's schedule
   */
  generateRecurringEvents(program: Program): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const baseEvent = this.programToEvent(program);

    // If the program has a recurring schedule in the JSON field
    const schedule = program.schedule as any;
    if (schedule?.recurring && schedule?.pattern) {
      // This would generate multiple events based on the pattern
      // For now, just return the base event
      events.push(baseEvent);
    } else {
      events.push(baseEvent);
    }

    return events;
  },

  /**
   * Convert Program to CalendarEvent
   */
  programToEvent(program: Program): CalendarEvent {
    const schedule = program.schedule as any;
    return {
      id: program.id,
      title: program.name,
      description: program.description,
      start: program.startDate,
      end: program.endDate,
      category: program.category,
      location: schedule?.location,
      recurring: schedule?.recurring || false,
      recurringSchedule: schedule,
      programId: program.id,
      type: 'program',
    };
  },

  /**
   * Convert multiple Programs to CalendarEvents
   */
  programsToEvents(programs: Program[]): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    for (const program of programs) {
      // Generate recurring events if applicable
      const programEvents = this.generateRecurringEvents(program);
      events.push(...programEvents);
    }

    return events;
  },

  /**
   * Get calendar statistics
   */
  async getStats() {
    const now = new Date();
    const [total, upcoming, past, ongoing] = await Promise.all([
      prisma.program.count(),
      prisma.program.count({ where: { startDate: { gt: now } } }),
      prisma.program.count({ where: { endDate: { lt: now } } }),
      prisma.program.count({
        where: {
          AND: [{ startDate: { lte: now } }, { endDate: { gte: now } }],
        },
      }),
    ]);

    return {
      total,
      upcoming,
      past,
      ongoing,
    };
  },
};

export default calendarService;

