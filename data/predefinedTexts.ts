// /data/predefinedTexts.ts

// We definiëren een type voor onze objecten voor type-safety.
export interface PredefinedText {
  title: string;
  text: string;
}

// We exporteren een array met de standaard teksten.
export const texts: PredefinedText[] = [
  {
    title: 'Paddy Mayne',
    text: `Lt-Col. R.B. Mayne DSO has commanded 1 SAS Regiment throughout the period of operations in France. On 8 August 1944, he was dropped to Operation Houndsworth base, located west of Dijon, in order to co-ordinate and take charge of the available detachments of his Regiment and co-ordinate their activities with a major Airborne landing which was then envisaged near Paris. He then proceeded in a jeep in daylight to motor to the GAIN base making the complete journey in one day. On the approach of Allied Forces, he passed through the lines in his jeep to contact the American Forces and to lead back through the lines his detachment of twenty jeeps landed for Operation Wallace. During the next few weeks, he successfully penetrated the German and American lines on four occasions in order to lead parties of reinforcements. It was entirely due to Lt-Col. Mayne's fine leadership and example, and his utter disregard for danger, that the unit was able to achieve such striking successes.`
  },
  {
    title: 'Fotosynthese',
    text: 'Fotosynthese is het proces waarbij planten, algen en sommige bacteriën lichtenergie omzetten in chemische energie. Met behulp van zonlicht, water en koolstofdioxide produceren ze glucose (suiker) als voeding en zuurstof als bijproduct. Dit proces is essentieel voor het leven op aarde.'
  },
  {
    title: 'De Romeinse Republiek',
    text: 'De Romeinse Republiek werd gesticht in 509 v.Chr. en was een periode van grote expansie voor Rome. Het werd bestuurd door senatoren en gekozen magistraten, zoals consuls. Interne conflicten en burgeroorlogen leidden uiteindelijk tot de val van de Republiek en de opkomst van het Romeinse Keizerrijk onder Augustus in 27 v.Chr.'
  }
];