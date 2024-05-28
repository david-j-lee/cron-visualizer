import CronDateInput from './components/CronDateInput'
import CronReader from './components/CronReader'
import CronSettingsInput, { CronSettings } from './components/CronSettingsInput'
import CronStringInput from './components/CronStringInput'
import CronTimeline from './components/CronTimeline'
import GitHubLink from './components/GitHubLink'
import { useCronHumanText } from './hooks/useCronHumanText'
import { useCronScheduler } from './hooks/useCronScheduler'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo, useState } from 'preact/hooks'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function App() {
  const userTimeZone = useMemo(() => dayjs.tz.guess() ?? 'UTC', [])
  const timeZones = useMemo(() => [userTimeZone, 'UTC'], [userTimeZone])

  const [cronString, setCronString] = useState('')
  const [cronSettings, setCronSettings] = useState<CronSettings>({
    startDateTime: null,
    timeZone: userTimeZone,
  })
  const [timelineDateInput, setTimelineDateInput] = useState(
    dayjs().format('YYYY-MM-DD')
  )

  const timelineDate = useMemo(
    () =>
      dayjs.tz(timelineDateInput, 'YYYY-MM-DD', userTimeZone).startOf('day'),
    [timelineDateInput, userTimeZone]
  )

  const { humanReadableDescription } = useCronHumanText(cronString)
  const { scheduledDateTimes } = useCronScheduler(
    cronString,
    cronSettings,
    timelineDate
  )

  return (
    <>
      <div class="cron-input-container">
        <CronStringInput value={cronString} setValue={setCronString} />
        <CronSettingsInput value={cronSettings} setValue={setCronSettings} />
      </div>
      <CronReader description={humanReadableDescription} />
      <CronDateInput
        value={timelineDateInput}
        setValue={setTimelineDateInput}
      />
      <CronTimeline
        date={timelineDate}
        timeZones={timeZones}
        scheduledDateTimes={scheduledDateTimes}
      />
      <GitHubLink />
    </>
  )
}