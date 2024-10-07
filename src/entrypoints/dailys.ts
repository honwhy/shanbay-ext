interface VocabularySense {
  created_at: string
  definition_cn: string
  definition_en: string
  dictionary_id: string
  id: string
  pos: string
  sequence: number
  sound: {
    audio_def_cn_name: string
    audio_def_cn_url: string
    audio_uk_name: string
    audio_uk_urls: string[]
    audio_us_name: string
    audio_us_urls: string[]
    ipa_uk: string
    ipa_us: string
  }
  updated_at: string
  vocabulary_id: string
}

interface Item {
  type_of: string
  vocabulary: Vocabulary
}

export interface RootObject {
  ipp: number
  objects: Item[]
  page: number
  total: number
}
interface Vocabulary {
  comment?: string
  created_at: string
  id: string
  ref_id: string
  senses: VocabularySense[]
  sound: {
    audio_def_cn_name: string
    audio_def_cn_url: string
    audio_uk_name: string
    audio_uk_urls: string[]
    audio_us_name: string
    audio_us_urls: string[]
    ipa_uk: string
    ipa_us: string
  }
  updated_at: string
  vocab_type: number
  vocabulary_id: string
  word: string
}

export default {}
