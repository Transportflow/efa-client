export interface SystemMessage {
  code: number;
  error?: string;
  text?: string;
  type: "error" | "warning" | "message";
  module: string;
}

export interface EFAError {
  code: number;
  name: string;
  description: string;
  nonCritical?: boolean;
}

export const getErrorDetails = (errorCode: number): EFAError => {
  const errorDetails: Record<number, EFAError> = {
    /* General definition:
    SUCCESS 0 OK
    UNKNOWN_VALUE -1 Ungültiger Wert
    INTERNAL_ERROR -100 Interner Fehler
    COMMUNICATION_ERROR -101 Kommunikationsproblem
    */
    0: {
      code: 0,
      name: "SUCCESS",
      description: "OK",
    },
    "-1": {
      code: -1,
      name: "UNKNOWN_VALUE",
      description: "Ungültiger Wert",
    },
    "-100": {
      code: -100,
      name: "INTERNAL_ERROR",
      description: "Interner Fehler",
    },
    "-101": {
      code: -101,
      name: "COMMUNICATION_ERROR",
      description: "Kommunikationsproblem",
    },
    /* Point Verification Errors:
    PLACE_INVALID -1000 Ungültige Ortseingabe
    PLACE_WITHOUT_STOPS -1001 Verifizierter Ort hat keine
    Haltestelle
    PLACE_UNKNOWN_POOL -1010 Ort nicht in Ortebaum enthalten
    PLACE_ALPHA_INVALID -1020 Ungültige invalid alpha list*/
    "-1000": {
      code: -1000,
      name: "PLACE_INVALID",
      description: "Ungültige Ortseingabe",
    },
    "-1001": {
      code: -1001,
      name: "PLACE_WITHOUT_STOPS",
      description: "Verifizierter Ort hat keine Haltestelle",
    },
    "-1010": {
      code: -1010,
      name: "PLACE_UNKNOWN_POOL",
      description: "Ort nicht in Ortebaum enthalten",
    },
    "-1020": {
      code: -1020,
      name: "PLACE_ALPHA_INVALID",
      description: "Ungültige invalid alpha list",
    },
    /*
    STOP_INVALID -2000 Ungültige Haltestelleneingabe
    STOP_PLACE_ID_INVALID -2001 Haltestellennummer in Ort nicht
    enthalten
    */
    "-2000": {
      code: -2000,
      name: "STOP_INVALID",
      description: "Ungültige Haltestelleneingabe",
    },
    "-2001": {
      code: -2001,
      name: "STOP_PLACE_ID_INVALID",
      description: "Haltestellennummer in Ort nicht enthalten",
    },
    /*
    ADDRESS_INVALID -3000 Ungültige Adresseingabe
    ADDRESS_PLACE_WITHOUT_ADDR -3001 Ort hat keine Adressen
    */
    "-3000": {
      code: -3000,
      name: "ADDRESS_INVALID",
      description: "Ungültige Adresseingabe",
    },
    "-3001": {
      code: -3001,
      name: "ADDRESS_PLACE_WITHOUT_ADDR",
      description: "Ort hat keine Adressen",
    },
    /* ALPHA_INDEX_TOO_MANY_ELEMENTS -6000 Zu viele Elemente für Alphalisten */
    "-6000": {
      code: -6000,
      name: "ALPHA_INDEX_TOO_MANY_ELEMENTS",
      description: "Zu viele Elemente für Alphalisten",
    },
    /* 
    IT_GEOREF_UNKNOWN -200 Georeferenz ungültig
    IT_GEOREF_OUT_OF_REGION -201 Georeferenz ungültig da Kante <
    0 or > Länge der Kante
    IT_NO_START -300 Kein Startpunkt angegeben
    IT_NO_DESTINATION -301 Kein Zielpunkt angegeben
    IT_NO_CONNECTION -302 Keine Verbindung gefunden
    IT_NO_TRANSITIONS -303 Keine Übergangspunkte
    erreichbar
    */
    "-200": {
      code: -200,
      name: "IT_GEOREF_UNKNOWN",
      description: "Georeferenz ungültig",
    },
    "-201": {
      code: -201,
      name: "IT_GEOREF_OUT_OF_REGION",
      description: "Georeferenz ungültig da Kante < 0 or > Länge der Kante",
    },
    "-300": {
      code: -300,
      name: "IT_NO_START",
      description: "Kein Startpunkt angegeben",
    },
    "-301": {
      code: -301,
      name: "IT_NO_DESTINATION",
      description: "Kein Zielpunkt angegeben",
    },
    "-302": {
      code: -302,
      name: "IT_NO_CONNECTION",
      description: "Keine Verbindung gefunden",
    },
    "-303": {
      code: -303,
      name: "IT_NO_TRANSITIONS",
      description: "Keine Übergangspunkte erreichbar",
    },
    /* 
    IT_LOCATOR_INVALID -5000 Eingegebener Ort ist ungültig
    IT_LOCATOR_INVALID_POOL -5001 Eingegebener Ort nicht in
    Ortebaum vorhanden
    IT_LOCATOR_BULK_POSTCODE -5002 Bulk Postcode,
    Postcode/Postfahc ohne
    Adressen (SE)
    */
    "-5000": {
      code: -5000,
      name: "IT_LOCATOR_INVALID",
      description: "Eingegebener Ort ist ungültig",
    },
    "-5001": {
      code: -5001,
      name: "IT_LOCATOR_INVALID_POOL",
      description: "Eingegebener Ort nicht in Ortebaum vorhanden",
    },
    "-5002": {
      code: -5002,
      name: "IT_LOCATOR_BULK_POSTCODE",
      description: "Bulk Postcode, Postcode/Postfahc ohne Adressen (SE)",
    },
    /*
    AST_NO_AREA_FOUND -600 AST-Gebiet nicht gefunden
    AST_NO_STOPS_FOUND -700 AST-Haltestellen nicht gefunden
    */
    "-600": {
      code: -600,
      name: "AST_NO_AREA_FOUND",
      description: "AST-Gebiet nicht gefunden",
    },
    "-700": {
      code: -700,
      name: "AST_NO_STOPS_FOUND",
      description: "AST-Haltestellen nicht gefunden",
    },
    /*
    ANY_UNIQUE -8010 Any eindeutig verifiziert
    ANY_LIST -8011 Any-Liste verifiziert
    ANY_INVALID -8012 Any-Eingabe ungültig
    ANY_PLACE_WITHOUT_MATCHES -8013 Any-Ort gefunden, hat jedoch keine
    Verifikationsmöglichkeit
    ANY_TOO_MANY_MATCHES -8014 Any-Eingabe bringt zu viele Treffer
    ANY_MATCH_NONE -8020 Kein Treffer 
    INFO_MATCH -8031 Treffer (z.B. Gebäude) zu einer
    Straße gefunden
    INFO_NO_MATCH -8032 Keine Treffer (z.B. Gebäud
    */
    "-8010": {
      code: -8010,
      name: "ANY_UNIQUE",
      description: "Any eindeutig verifiziert",
    },
    "-8011": {
      code: -8011,
      name: "ANY_LIST",
      description: "Das Ergebnis ist kein einzelner Punkt sondern eine Liste.",
      nonCritical: true,
    },
    "-8012": {
      code: -8012,
      name: "ANY_INVALID",
      description: "Any-Eingabe ungültig",
    },
    "-8013": {
      code: -8013,
      name: "ANY_PLACE_WITHOUT_MATCHES",
      description:
        "Any-Ort gefunden, hat jedoch keine Verifikationsmöglichkeit",
    },
    "-8014": {
      code: -8014,
      name: "ANY_TOO_MANY_MATCHES",
      description: "Any-Eingabe bringt zu viele Treffer",
    },
    "-8020": {
      code: -8020,
      name: "ANY_MATCH_NONE",
      description: "Kein Treffer",
    },
    "-8031": {
      code: -8031,
      name: "INFO_MATCH",
      description: "Treffer (z.B. Gebäude) zu einer Straße gefunden",
    },
    "-8032": {
      code: -8032,
      name: "INFO_NO_MATCH",
      description: "Keine Treffer (z.B. Gebäude) zu einer Straße gefunden",
    },
    /*
    YearMessageCode -10 Ungültiger Wert
    MonthMessageCode -20 Ungültiger Wert
    DayMessageCode -30 Ungültiger Wert
    */
    "-10": {
      code: -10,
      name: "YearMessageCode",
      description: "Ungültiger Wert",
    },
    "-20": {
      code: -20,
      name: "MonthMessageCode",
      description: "Ungültiger Wert",
    },
    "-30": {
      code: -30,
      name: "DayMessageCode",
      description: "Ungültiger Wert",
    },
    /*
    NO_CONNECTION -4000 Keine Verbindung zur angegebenen Uhrzeit 
    DATE_INVALID -4001 Datum nicht in aktueller
    Fahrplanperiode möglich
    NO_ORIGIN -4002 Kein Start verifiziert
    NO_DESTINATION -4003 Kein Ziel verifiziert
    ORIGIN_UNKNOWN -4004 Start vorhanden, jedoch nicht
    auflösbar
    DESTINATION_UNKNOWN -4005 Ziel vorhanden, jedoch nicht
    auflösbar
    JUST_WALK -4006 Nur eine Fußwegverbindung
    gefunden
    ORIGIN_EQUI_DEST -4007 Start und Ziel identisch
    VIA_UNKNOWN -4008 Unbekannter Via-Haltepunkt
    übergeben
    TIMESPAN_INVALID -4009 Zeitintervall ist ungültig
    VIA_NOINTERCHANGE -4010 Via-Haltepunkt ist keine
    Umstiegshaltestelle
    VIA_INVALID -4011 Ungültige Via-Eingabe
    TRIPSTATUS_ALREADYFOUND +4011 Geschobene Fahrt schon
    vorhanden
    ORIGIN_OUTOFPERMITTEDAREA -4012 Start außerhalb der gültigen
    Zone (z.B. bei
    Fahrpreiszonen)
    DESTINATION_OUTOFPERMITTEDAREA -4013 Ziel außerhalb der gültigen
    Zone (z.B. bei
    Fahrpreiszonen)
    VIA_OUTOFPERMITTEDAREA -4014 Via außerhalb der gültigen
    Zone (z.B. bei
    Fahrpreiszonen)
    NO_TRANSITION -4020 Keine Übergangspunkte
    gefunden
    NO_DEPARTURE -4030 Keine Abfahrten gefunden
    NO_ARRIVAL -4040 Keine Ankünfte gefunden
    */
    "-4000": {
      code: -4000,
      name: "NO_CONNECTION",
      description: "Keine Verbindung zur angegebenen Uhrzeit",
    },
    "-4001": {
      code: -4001,
      name: "DATE_INVALID",
      description: "Datum nicht in aktueller Fahrplanperiode möglich",
    },
    "-4002": {
      code: -4002,
      name: "NO_ORIGIN",
      description: "Kein Start verifiziert",
    },
    "-4003": {
      code: -4003,
      name: "NO_DESTINATION",
      description: "Kein Ziel verifiziert",
    },
    "-4004": {
      code: -4004,
      name: "ORIGIN_UNKNOWN",
      description: "Start vorhanden, jedoch nicht auflösbar",
    },
    "-4005": {
      code: -4005,
      name: "DESTINATION_UNKNOWN",
      description: "Ziel vorhanden, jedoch nicht auflösbar",
    },
    "-4006": {
      code: -4006,
      name: "JUST_WALK",
      description: "Nur eine Fußwegverbindung gefunden",
    },
    "-4007": {
      code: -4007,
      name: "ORIGIN_EQUI_DEST",
      description: "Start und Ziel identisch",
    },
    "-4008": {
      code: -4008,
      name: "VIA_UNKNOWN",
      description: "Unbekannter Via-Haltepunkt übergeben",
    },
    "-4009": {
      code: -4009,
      name: "TIMESPAN_INVALID",
      description: "Zeitintervall ist ungültig",
    },
    "-4010": {
      code: -4010,
      name: "VIA_NOINTERCHANGE",
      description: "Via-Haltepunkt ist keine Umstiegshaltestelle",
    },
    "-4011": {
      code: -4011,
      name: "VIA_INVALID",
      description: "Ungültige Via-Eingabe",
    },
    "-4012": {
      code: -4012,
      name: "ORIGIN_OUTOFPERMITTEDAREA",
      description:
        "Start außerhalb der gültigen Zone (z.B. bei Fahrpreiszonen)",
    },
    "-4013": {
      code: -4013,
      name: "DESTINATION_OUTOFPERMITTEDAREA",
      description: "Ziel außerhalb der gültigen Zone (z.B. bei Fahrpreiszonen)",
    },
    "-4014": {
      code: -4014,
      name: "VIA_OUTOFPERMITTEDAREA",
      description: "Via außerhalb der gültigen Zone (z.B. bei Fahrpreiszonen)",
    },
    "-4020": {
      code: -4020,
      name: "NO_TRANSITION",
      description: "Keine Übergangspunkte gefunden",
    },
    "-4030": {
      code: -4030,
      name: "NO_DEPARTURE",
      description: "Keine Abfahrten gefunden",
    },
    "-4040": {
      code: -4040,
      name: "NO_ARRIVAL",
      description: "Keine Ankünfte gefunden",
    },
    /*
    NO_SERVINGLINES -4050 Keine bedienenden Linien
    vorhanden
    NO_MATCHINGOPERATORS -4060 Kein Betreiber gefunden
    NO_CONNECTION_BECAUSE_OF_RULE -4100 Keine Fahrtauskunft aufgrund
    einer Regel
    RULE_CHANGED_OPTIONS -4101 Regel hat die Optionen
    verändert
    RULE_CHANGED_USEONLY -4102 Regel hat die zulässigen
    Fahrzeuge verändert
    RECOMPUTE_BECAUSE_OF_RULE -4103 Fahrtauskunft wurde aufgrund
    einer Regel mit angepassten
    Parametern erneut berechnet
    RULE_CHANGED_WITHOUTVIA -4104 Regel hat den VIA-Punkt
    entfernt
    NO_CONNECTION_BECAUSE_OF_
    PREFERTOEXCLUDE_SETTINGS
    -4300 Ungültige prefer-to-exclude
    Parameter
    NO_CONNECTION_BECAUSE_OF_
    PREFERTOINCLUDE_SETTINGS
    -4301 Ungültige prefer-to-include
    Parameter
    NO_CONNECTION_BECAUSE_OF_
    MIXEDSETTING_SETTINGS
    -4302 Ungültige Vermischung von
    prefer-to-exclude/include
    Parameter
    NO_CONNECTION_BECAUSE_OF_
    WALKING_SETTINGS
    -4303 Ungültige Fußwegparameter
    TRIP_CANCELLED -9999 Fahrt fällt aus
    */
    "-4050": {
      code: -4050,
      name: "NO_SERVINGLINES",
      description: "Keine bedienenden Linien vorhanden",
    },
    "-4060": {
      code: -4060,
      name: "NO_MATCHINGOPERATORS",
      description: "Kein Betreiber gefunden",
    },
    "-4100": {
      code: -4100,
      name: "NO_CONNECTION_BECAUSE_OF_RULE",
      description: "Keine Fahrtauskunft aufgrund einer Regel",
    },
    "-4101": {
      code: -4101,
      name: "RULE_CHANGED_OPTIONS",
      description: "Regel hat die Optionen verändert",
    },
    "-4102": {
      code: -4102,
      name: "RULE_CHANGED_USEONLY",
      description: "Regel hat die zulässigen Fahrzeuge verändert",
    },
    "-4103": {
      code: -4103,
      name: "RECOMPUTE_BECAUSE_OF_RULE",
      description:
        "Fahrtauskunft wurde aufgrund einer Regel mit angepassten Parametern erneut berechnet",
    },
    "-4104": {
      code: -4104,
      name: "RULE_CHANGED_WITHOUTVIA",
      description: "Regel hat den VIA-Punkt entfernt",
    },
    "-4300": {
      code: -4300,
      name: "NO_CONNECTION_BECAUSE_OF_PREFERTOEXCLUDE_SETTINGS",
      description: "Ungültige prefer-to-exclude Parameter",
    },
    "-4301": {
      code: -4301,
      name: "NO_CONNECTION_BECAUSE_OF_PREFERTOINCLUDE_SETTINGS",
      description: "Ungültige prefer-to-include Parameter",
    },
    "-4302": {
      code: -4302,
      name: "NO_CONNECTION_BECAUSE_OF_MIXEDSETTING_SETTINGS",
      description:
        "Ungültige Vermischung von prefer-to-exclude/include Parameter",
    },
    "-4303": {
      code: -4303,
      name: "NO_CONNECTION_BECAUSE_OF_WALKING_SETTINGS",
      description: "Ungültige Fußwegparameter",
    },
    "-9999": {
      code: -9999,
      name: "TRIP_CANCELLED",
      description: "Fahrt fällt aus",
    },
    /* ERROR_ITROUTER_NO_IT_CONN -10015 Keine Verbindung gefunden */
    "-10015": {
      code: -10015,
      name: "ERROR_ITROUTER_NO_IT_CONN",
      description: "Keine Verbindung gefunden",
    },
    /*
    PARKING_INVALID -9000 Kein Treffer
    PARKING_TOO_MANY_MATCHES -9001 Zu viele Treffer
    */
    "-9000": {
      code: -9000,
      name: "PARKING_INVALID",
      description: "Kein Treffer",
    },
    "-9001": {
      code: -9001,
      name: "PARKING_TOO_MANY_MATCHES",
      description: "Zu viele Treffer",
    },
    /* NO_MATCHINGLINES -5010 Keine übereinstimmenden Linien gefunden */
    "-5010": {
      code: -5010,
      name: "NO_MATCHINGLINES",
      description: "Keine übereinstimmenden Linien gefunden",
    },
  };

  return errorDetails[errorCode];
};
