import xmlrpc from "xmlrpc";

export function create_client(path, url) {
  return xmlrpc.createClient({
    url: `${url}${path}`,
  });
}
