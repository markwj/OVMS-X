
export function GetCurrentUTCTimeStamp() : string {
  return new Date().toISOString().replace('T', '').replace('.000Z', ' UTC')
}