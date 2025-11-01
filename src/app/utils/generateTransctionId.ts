export const generateTransactionId = (): string => {
  const date = new Date()

  const transactionId = `Empirical-${date.getFullYear()}-${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(
      2,
      '0',
    )}-${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`

  return transactionId
}
