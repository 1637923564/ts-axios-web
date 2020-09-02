const cookie = {
  read(cookieName: string | undefined): string | null {
    const reg = new RegExp('(^|;\\s*)(' + cookieName + ')=([^;]*)')
    const match = document.cookie.match(reg)

    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
