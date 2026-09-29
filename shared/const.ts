export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = "Please login (10001)";
export const NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

export const ENGINS_BRANDS = {
  CATERPILLAR: "CATERPILLAR",
  KOMATSU: "KOMATSU",
  VOLVO_CE: "VOLVO_CE",
  LIEBHERR: "LIEBHERR",
  HITACHI: "HITACHI",
  JOHN_DEERE: "JOHN_DEERE",
  JCB: "JCB",
  CASE: "CASE",
  WACKER_NEUSON: "WACKER_NEUSON",
  BOMAG: "BOMAG",
  SANY: "SANY",
  XCMG: "XCMG",
  ZOOMLION: "ZOOMLION",
  HYUNDAI: "HYUNDAI",
  KUBOTA: "KUBOTA",
  BOBCAT: "BOBCAT",
  MANITOU: "MANITOU",
  HAULOTTE: "HAULOTTE",
  HAMM: "HAMM",
  VOGELE: "VOGELE",
} as const;

export type EngineBrand = keyof typeof ENGINS_BRANDS;
export const enginesBrandList = Object.keys(ENGINS_BRANDS) as EngineBrand[];
// export type Brands = (typeof ENGINS_BRANDS)[keyof typeof ENGINS_BRANDS];

// Engine type
export const BTP_ENGINE_TYPES = {
  EXCAVATOR: "EXCAVATOR", // Pelle hydraulique
  MINI_EXCAVATOR: "MINI_EXCAVATOR", // Mini-pelle
  BACKHOE_LOADER: "BACKHOE_LOADER", // Tractopelle
  WHEEL_LOADER: "WHEEL_LOADER", // Chargeuse sur pneus
  TRACK_LOADER: "TRACK_LOADER", // Chargeuse sur chenilles
  BULLDOZER: "BULLDOZER", // Bouteur / Bulldozer
  MOTOR_GRADER: "MOTOR_GRADER", // Niveleuse
  SKID_STEER: "SKID_STEER", // Mini-chargeuse (type Bobcat)
  TELEHANDLER: "TELEHANDLER", // Chariot télescopique (type Manitou)
  AERIAL_WORK_PLATFORM: "AERIAL_WORK_PLATFORM", // Nacelle élévatrice / PEMP
  MOBILE_CRANE: "MOBILE_CRANE", // Grue mobile
  TOWER_CRANE: "TOWER_CRANE", // Grue à tour
  CRANE_TRUCK: "CRANE_TRUCK", // Camion grue
  FORKLIFT: "FORKLIFT", // Chariot élévateur
  DUMPER: "DUMPER", // Tombereau de chantier
  TIPPER_TRUCK: "TIPPER_TRUCK", // Camion benne
  SOIL_COMPACTOR: "SOIL_COMPACTOR", // Compacteur de sol / Rouleau
  TANDEM_ROLLER: "TANDEM_ROLLER", // Rouleau tandem / Asphalte
  ASPHALT_PAVER: "ASPHALT_PAVER", // Finisseur d'enrobé
  CONCRETE_MIXER_TRUCK: "CONCRETE_MIXER_TRUCK", // Camion toupie / Bétonnière
  CONCRETE_PUMP: "CONCRETE_PUMP", // Pompe à béton
  GENERATOR: "GENERATOR", // Groupe électrogène
  COMPRESSOR: "COMPRESSOR", // Compresseur d'air
} as const;

export type EngineType =
  (typeof BTP_ENGINE_TYPES)[keyof typeof BTP_ENGINE_TYPES];
