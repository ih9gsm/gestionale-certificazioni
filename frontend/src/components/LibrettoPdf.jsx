import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20, fontSize: 14, fontWeight: 'bold' },
  section: { marginBottom: 15, paddingBottom: 5, borderBottom: '1px solid #ccc' },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 150, fontWeight: 'bold' },
  value: { flex: 1 },
  title: { fontSize: 12, marginBottom: 5, fontFamily: 'Helvetica-Bold' },
  box: { border: '1px solid #000', padding: 10, marginBottom: 10 }
});

export default function LibrettoPdf({ libretto }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>LIBRETTO DI IMPIANTO PER LA CLIMATIZZAZIONE</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>(D.P.R. n. 74/2013)</Text>

        <View style={styles.section}>
          <Text style={styles.title}>1. SCHEDA IDENTIFICATIVA DELL'IMPIANTO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tipologia Impianto:</Text>
            <Text style={styles.value}>{libretto.tipo_impianto.replace('_', ' ').toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Indirizzo:</Text>
            <Text style={styles.value}>{libretto.indirizzo_impianto}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>2. RESPONSABILE DELL'IMPIANTO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome / Ragione Sociale:</Text>
            <Text style={styles.value}>{libretto.client_name}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>3. MANUTENTORE / INSTALLATORE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Ragione Sociale Impresa:</Text>
            <Text style={styles.value}>{libretto.installer_company}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Responsabile Tecnico:</Text>
            <Text style={styles.value}>{libretto.installer_resp || '---'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>4. GENERATORE PRINCIPALE</Text>
          <View style={styles.box}>
            <View style={styles.row}>
              <Text style={styles.label}>Tipo / Modello:</Text>
              <Text style={styles.value}>{libretto.tipo_generatore || 'N/D'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Matricola:</Text>
              <Text style={styles.value}>{libretto.matricola_generatore || 'N/D'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Potenza Termica Nominale:</Text>
              <Text style={styles.value}>{libretto.potenza_termica ? `${libretto.potenza_termica} kW` : 'N/D'}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text>Data di compilazione: {new Date(libretto.data_compilazione).toLocaleDateString()}</Text>
          </View>
          <View>
            <Text style={{ textAlign: 'center' }}>Firma del Manutentore/Installatore</Text>
            <Text style={{ marginTop: 20 }}>___________________________</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
