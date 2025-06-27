export const handleRedirec =  (form, method) => {
  const redirectUrl = window.location.pathname + window.location.search;
  form.action += `?_method=${method}&redirect=${encodeURIComponent(redirectUrl)}`;
  return form.submit();
}

