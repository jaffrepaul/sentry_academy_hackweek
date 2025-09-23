import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { getCourses, getCourseBySlug, getDataStatus } from '@/lib/actions/course-actions'

export default async function DebugPage() {
  // Test direct database query
  let directDbResult = null
  let directDbError = null

  try {
    directDbResult = await db.select().from(courses)
  } catch (error) {
    directDbError = error
  }

  // Test course actions
  let courseActionsResult = null
  let courseActionsError = null

  try {
    courseActionsResult = await getCourses()
  } catch (error) {
    courseActionsError = error
  }

  // Test getting a specific course
  let specificCourseResult = null
  let specificCourseError = null

  try {
    specificCourseResult = await getCourseBySlug('sentry-fundamentals')
  } catch (error) {
    specificCourseError = error
  }

  // Get data status
  let dataStatus = null
  try {
    dataStatus = await getDataStatus()
  } catch (error) {
    dataStatus = { error: error instanceof Error ? error.message : String(error) }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Database Debug Information
        </h1>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Data Status
            </h2>
            <pre className="overflow-auto rounded bg-gray-100 p-2 text-sm text-gray-900 dark:bg-gray-700 dark:text-gray-100">
              {JSON.stringify(dataStatus, null, 2)}
            </pre>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Direct Database Query
            </h2>
            {directDbError ? (
              <div className="text-red-600 dark:text-red-400">
                Error:{' '}
                {directDbError instanceof Error ? directDbError.message : String(directDbError)}
              </div>
            ) : (
              <div>
                <p className="text-gray-900 dark:text-gray-100">
                  Found {directDbResult?.length || 0} courses
                </p>
                {directDbResult && (
                  <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-sm text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                    {JSON.stringify(directDbResult.slice(0, 2), null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Course Actions Query
            </h2>
            {courseActionsError ? (
              <div className="text-red-600 dark:text-red-400">
                Error:{' '}
                {courseActionsError instanceof Error
                  ? courseActionsError.message
                  : String(courseActionsError)}
              </div>
            ) : (
              <div>
                <p className="text-gray-900 dark:text-gray-100">
                  Found {courseActionsResult?.length || 0} courses
                </p>
                {courseActionsResult && (
                  <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-sm text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                    {JSON.stringify(courseActionsResult.slice(0, 2), null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Specific Course Query (sentry-fundamentals)
            </h2>
            {specificCourseError ? (
              <div className="text-red-600 dark:text-red-400">
                Error:{' '}
                {specificCourseError instanceof Error
                  ? specificCourseError.message
                  : String(specificCourseError)}
              </div>
            ) : (
              <div>
                {specificCourseResult ? (
                  <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-sm text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                    {JSON.stringify(specificCourseResult, null, 2)}
                  </pre>
                ) : (
                  <p className="text-yellow-600 dark:text-yellow-400">Course not found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
