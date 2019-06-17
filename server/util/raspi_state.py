import subprocess

def get_disk_info():
    p = subprocess.Popen('df -h', shell=True, stdout=subprocess.PIPE)
    (out, err) = p.communicate()

    out = out.decode('ascii').split('\n')
    for line in out:
        pline = [e.replace('G', '') for e in line.split(' ') if e]
        if pline[0] == '/dev/root':
            return {'disk_size': pline[1], 'disk_used': pline[2], 'disk_avail': pline[3], 'disk_used%': pline[4]}

if __name__ == '__main__' :
    print(get_disk_info())