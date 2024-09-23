/*
"priority": "normal",
"id": "21408",
"version": 242312461,
"type": "lineInfo",
"infoLinks": [
{
    "urlText": "Dresden - Altnossener Straße, Instandsetzungsarbeiten",
    "url": "http://192.168.150.204:8081/ics/XSLT_CM_SHOWADDINFO_REQUEST?infoID=21408&seqID=242312461",
    "content": "..."
    "subtitle": "Dresden - Altnossener Straße, Instandsetzungsarbeiten",
    "title": "Linienaenderung",
    "additionalText": "inEFA=\"false\";MeldungTyp=\"Information\"",
    "htmlText": "..."
}
*/

export type ICSInfo = {
  priority: string;
  id: string;
  version: number;
  type: string;
  infoLinks: {
    title: string;
    subtitle: string;
    content: string;
    additionalText: string;
    urlText?: string;
    url?: string;
    htmlText?: string;
  }[];
};
