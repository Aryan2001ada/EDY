'use client'

import { useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { getUniversities, updateUniversity } from '@/actions/universities'
import { University } from '@prisma/client'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FaCalendar } from 'react-icons/fa'

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: University
}

export default function CalendarPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUniversities()
  }, [])

  async function loadUniversities() {
    setLoading(true)
    const result = await getUniversities()
    if (result.success && result.data) {
      setUniversities(result.data)

      // Convert to calendar events
      const calendarEvents: CalendarEvent[] = result.data
        .filter((uni) => uni.examDeadlineDate)
        .map((uni) => ({
          id: uni.id,
          title: `${uni.name} - Exam Deadline`,
          start: new Date(uni.examDeadlineDate!),
          end: new Date(uni.examDeadlineDate!),
          resource: uni,
        }))

      setEvents(calendarEvents)
    }
    setLoading(false)
  }

  async function handleDateUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedEvent) return

    const formData = new FormData(e.currentTarget)
    formData.set('name', selectedEvent.resource.name)

    const result = await updateUniversity(selectedEvent.id, formData)
    if (result.success) {
      setIsModalOpen(false)
      setSelectedEvent(null)
      loadUniversities()
    } else {
      alert(result.error)
    }
  }

  function handleSelectEvent(event: CalendarEvent) {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  // Custom event styling
  const eventStyleGetter = (event: CalendarEvent) => {
    const daysUntil = Math.ceil(
      (event.start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    let backgroundColor = '#0ea5e9' // default blue
    if (daysUntil < 0) {
      backgroundColor = '#9ca3af' // gray - past
    } else if (daysUntil <= 7) {
      backgroundColor = '#ef4444' // red - urgent
    } else if (daysUntil <= 30) {
      backgroundColor = '#f59e0b' // orange - soon
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Exam Deadline Calendar</h1>
        <p className="text-gray-600 mt-2">Manage and track university exam deadlines</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Past Deadlines</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Within 7 days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Within 30 days</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">30+ days</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: 700 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={['month', 'agenda']}
              defaultView="month"
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <FaCalendar className="text-primary-600 text-2xl" />
              <h2 className="text-2xl font-bold">Edit Exam Deadline</h2>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">University</p>
              <p className="text-lg font-semibold">{selectedEvent.resource.name}</p>
            </div>

            <form onSubmit={handleDateUpdate}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Deadline Date
                </label>
                <input
                  type="date"
                  name="examDeadlineDate"
                  defaultValue={
                    selectedEvent.resource.examDeadlineDate
                      ? new Date(selectedEvent.resource.examDeadlineDate).toISOString().split('T')[0]
                      : ''
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedEvent(null)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
