// /data/predefinedTopics.ts

// The interface now includes an 'active' flag
export interface PredefinedTopic {
  title: string;
  text: string;
  active: boolean; // Is this topic ready for the adaptive learning system?
}

export const topics: PredefinedTopic[] = [
  {
    title: 'Lt-Col. "Paddy" Mayne',
    text: 'Lt-Col. R.B. Mayne DSO has commanded 1 SAS Regiment throughout the period of operations in France. On 8 August 1944, he was dropped to Operation Houndsworth base, located west of Dijon, in order to co-ordinate and take charge of the available detachments of his Regiment and co-ordinate their activities with a major Airborne landing which was then envisaged near Paris. He then proceeded in a jeep in daylight to motor to the GAIN base making the complete journey in one day. On the approach of Allied Forces, he passed through the lines in his jeep to contact the American Forces and to lead back through the lines his detachment of twenty jeeps landed for Operation Wallace. During the next few weeks, he successfully penetrated the German and American lines on four occasions in order to lead parties of reinforcements. It was entirely due to Lt-Col. Mayne\'s fine leadership and example, and his utter disregard for danger, that the unit was able to achieve such striking successes.',
    active: true, // This is the one we have a domainModel for
  },
  {
    title: 'De Watercyclus',
    text: 'De watercyclus, ook bekend als de hydrologische cyclus, beschrijft de continue beweging van water op, boven en onder het oppervlak van de aarde.',
    active: false,
  },
  {
    title: 'Fotosynthese',
    text: 'Fotosynthese is het proces waarbij planten, algen en sommige bacteriën lichtenergie omzetten in chemische energie.',
    active: false,
  }
];