import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { generateEvents } from '../lib/data'

export const handlers = [
  http.get('/api/events', ({ request }) => {
    const url = new URL(request.url)
    const seed = Number(url.searchParams.get('seed') ?? '42')
    const days = Number(url.searchParams.get('days') ?? '30')
    const count = Number(url.searchParams.get('count') ?? '100000')
    const data = generateEvents(seed, days, count)
    return HttpResponse.json({ data })
  }),
]

export const worker = setupWorker(...handlers)
