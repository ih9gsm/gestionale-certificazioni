import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20, fontSize: 14, fontWeight: 'bold' },
  section: { marginBottom: 15, paddingBottom: 5, borderBottom: '1px solid #ccc' },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 150, fontWeight: 'bold' },
  value: { flex: 1 },
  checkboxRow: { flexDirection: 'row', marginBottom: 5, alignItems: 'center' },
  checkbox: { width: 10, height: 10, border: '1px solid #000', marginRight: 5, textAlign: 'center', fontSize: 8 },
  bold: { fontWeight: 'bold', fontFamily: 'Helvetica-Bold' },
  title: { fontSize: 12, marginBottom: 5, fontFamily: 'Helvetica-Bold' }
});

const Checkbox = ({ checked, label }) => (
  <View style={styles.checkboxRow}>
    <View style={styles.checkbox}>
      <Text>{checked ? 'X' : ' '}</Text>
    </View>
    <Text>{label}</Text>
  </View>
);

export default function DicoPdf({ dico }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>DICHIARAZIONE DI CONFORMITÀ DELL'IMPIANTO ALLA REGOLA DELL'ARTE</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>(Art. 7 del D.M. 22 Gennaio 2008, n. 37)</Text>

        <View style={styles.section}>
          <Text style={styles.title}>1. IMPRESA INSTALLATRICE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Ragione Sociale:</Text>
            <Text style={styles.value}>{dico.installer_company}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Titolare / Resp. Tecnico:</Text>
            <Text style={styles.value}>{dico.installer_resp || '---'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>2. DICHIARA SOTTO LA PROPRIA PERSONALE RESPONSABILITÀ</Text>
          <Text style={{ marginBottom: 5 }}>che l'impianto è stato realizzato in modo conforme alla regola dell'arte, secondo quanto previsto dall'art. 6, tenuto conto delle condizioni di esercizio e degli usi a cui è destinato l'edificio.</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo Intervento:</Text>
            <Text style={styles.value}>{dico.tipo_intervento.replace('_', ' ').toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Descrizione Impianto:</Text>
            <Text style={styles.value}>{dico.descrizione_impianto}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Indirizzo:</Text>
            <Text style={styles.value}>{dico.indirizzo_impianto}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>3. COMMITTENTE / PROPRIETARIO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome / Ragione Sociale:</Text>
            <Text style={styles.value}>{dico.client_name}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>4. ALLEGATI OBBLIGATORI</Text>
          <Checkbox checked={dico.allegato_progetto} label="Progetto ai sensi degli articoli 5 e 7" />
          <Checkbox checked={dico.allegato_relazione_materiali} label="Relazione con tipologie dei materiali utilizzati" />
          {dico.allegato_relazione_materiali && (
             <Text style={{ marginLeft: 20, marginTop: 5, marginBottom: 5, fontStyle: 'italic' }}>
               {dico.relazione_materiali_testo}
             </Text>
          )}
          <Checkbox checked={dico.allegato_schema_impianto} label="Schema di impianto realizzato" />
          <Checkbox checked={dico.allegato_certificato_requisiti} label="Copia del certificato di riconoscimento dei requisiti tecnico-professionali" />
        </View>

        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Data: {new Date().toLocaleDateString()}</Text>
          </View>
          <View>
            <Text style={{ textAlign: 'center' }}>Firma del Dichiarante</Text>
            <Text style={{ marginTop: 20 }}>___________________________</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
