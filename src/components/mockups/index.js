import UniWiseMock from './UniWiseMock'
import VisionMock from './VisionMock'
import CloudSevenMock from './CloudSevenMock'
import CrimeMock from './CrimeMock'
import CourseCompanionMock from './CourseCompanionMock'
import TovoMock from './TovoMock'

/**
 * Project id to its mockup. Both the index (as a hover preview) and the
 * detail sections read from here, so the two can never end up showing
 * different things for the same project.
 *
 * These are stylised representations built from each repository, not
 * screenshots, and they say so in their own headers. Nothing here claims
 * a feature the project does not have.
 */
export const mockups = {
  uniwise: UniWiseMock,
  vision: VisionMock,
  cloud: CloudSevenMock,
  crime: CrimeMock,
  course: CourseCompanionMock,
  tovo: TovoMock,
}

export default mockups
