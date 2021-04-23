function dateFormat(isoString: string) {
  const date = new Date(isoString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export default dateFormat;